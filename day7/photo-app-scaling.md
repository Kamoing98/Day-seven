# SnapShare — Scaling Plan

## Assumptions

- Registered users: 10,000,000 (10 million)
- Daily active users: 10% of registered = 1,000,000 (1 million)
- Each active user uploads 1 photo per day
- Each active user views 50 feed pages per day
- Average photo size: 2 MB
- Average thumbnail size: 50 KB (0.05 MB)
- Peak-to-average ratio: 5x
- Seconds per day: 86,400
- Days per year: 365

---

## Capacity Estimates

### Daily Active Users (DAU)

DAU = 10,000,000 x 10% = **1,000,000 users/day**

### Uploads Per Second

- Uploads per day = 1,000,000 users x 1 photo = 1,000,000 photos/day
- Uploads per second = 1,000,000 / 86,400 = **~12 uploads/sec**

### Feed Views Per Second

- Feed views per day = 1,000,000 users x 50 views = 50,000,000 views/day
- Average views per second = 50,000,000 / 86,400 = **~579 views/sec**
- Peak views per second (5x average) = 579 x 5 = **~2,894 views/sec**

### Photo Storage Per Year

- Storage per photo = 2 MB (original) + 0.05 MB (thumbnail) = 2.05 MB
- Photos per year = 1,000,000 x 365 = 365,000,000 photos
- Storage per year = 365,000,000 x 2.05 MB = 748,250,000 MB = **~714 TB/year**

---

## Read-Heavy or Write-Heavy?

**SnapShare is a read-heavy system.**

The read-to-write ratio is approximately 579 / 12 = ~50:1. For every photo uploaded, there are about 50 feed views.

**What this means for the design:**

- We must optimize for fast reads, since reads vastly outnumber writes.
- Caching is essential: most feed views should be served from cache, not the database.
- Read replicas should be used to spread read load across multiple database copies.
- A CDN should serve photos directly to users, bypassing app servers entirely.
- The write path can tolerate slightly higher latency since writes are relatively rare.
- Database indexing should prioritize read query patterns (feed lookups, follower queries).

---

## Why Photos Should NOT Be Stored in the Database

Photos should not be stored inside the database because:

1. Databases are optimized for structured data, not large binary objects — storing 2 MB files bloats tables and slows queries.
2. Databases are expensive per GB compared to object storage.
3. Serving large files from a database ties up connections and CPU that should serve metadata queries.
4. Database backups become impractically large when they include terabytes of binary data.
5. Databases do not scale horizontally as easily as object storage for large files.

**Instead, photos should be stored in Object Storage** (e.g., Amazon S3, Google Cloud Storage, Azure Blob Storage). Object storage is purpose-built for large binary files, is cheap per GB, scales infinitely, and integrates directly with CDNs for fast delivery. The database only stores metadata (photo ID, user ID, timestamps, URLs), while object storage holds the actual files.

---

## Architecture Diagram

```
                            +-----------------------+
                            |    USERS (Browsers,   |
                            |    Mobile Apps)       |
                            +-----------+-----------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
        Read requests (feed,                          Write requests (upload)
        photos, thumbnails)                                    |
                 |                                             |
                 v                                             v
        +----------------+                           +------------------+
        |      CDN       |                           |  Load Balancer   |
        | (edge caching  |                           | (distributes API |
        |  for images)   |                           |  to app servers) |
        +-------+--------+                           +--------+---------+
                |                                             |
                |                      +----------------------+----------------------+
                |                      |                      |                      |
                |                      v                      v                      v
                |               +------------+         +------------+         +------------+
                |               | App Server |         | App Server |         | App Server |
                |               |     1      |         |     2      |         |     N      |
                |               +-----+------+         +-----+------+         +-----+------+
                |                     |                      |                      |
                |                     +----------------------+------+--------------+
                |                                            |
                |                               +------------+------------+
                |                               |                         |
                |                               v                         v
                |                    +-------------------+      +-------------------+
                |                    |    Cache Layer    |      |  Message Queue    |
                |                    | (Redis/Memcached) |      | (thumbnail jobs)  |
                |                    | feed, sessions,   |      +---------+---------+
                |                    | hot data          |                |
                |                    +-------------------+                v
                |                                              +-------------------+
                |                                              |  Worker Service   |
                |                                              | (thumbnail gen)   |
                |                                              +---------+---------+
                |                                                        |
        +-------+--------------------------------------------------------+--------+
        |                                                                                |
        v                                                                                v
+------------------+                                                          +------------------+
| Object Storage   |                                                          |    Database      |
| (S3 / GCS)       |                                                          |                  |
|                  |                                                          | +--------------+ |
| - Original photos|                                                          | | Primary DB   | |
| - Thumbnails     |                                                          | | (writes)     | |
+------------------+                                                          | +------+-------+ |
                                                                              |        |         |
                                                                              |   replication   |
                                                                              |        |         |
                                                                              | +------v-------+ |
                                                                              | | Read Replica | |
                                                                              | | (reads)      | |
                                                                              | +--------------+ |
                                                                              +------------------+
```

---

## Component Descriptions (one sentence each)

- **CDN**: Caches photo files and thumbnails at edge locations close to users so image requests are served with low latency without hitting origin servers.
- **Load Balancer**: Distributes incoming API requests across multiple app servers to prevent any single server from being overwhelmed and to provide fault tolerance.
- **App Servers**: Process application logic including authentication, feed generation, upload handling, and API responses, and can be horizontally scaled by adding more instances.
- **Cache (Redis/Memcached)**: Stores frequently accessed data such as feeds and user sessions in memory so reads complete in milliseconds instead of querying the database.
- **Database (Primary)**: Stores all structured metadata (users, photos, followers, feed state) and handles all write operations with strong consistency.
- **Database (Read Replica)**: Maintains an asynchronous copy of the primary database to serve all read queries, offloading read traffic from the primary.
- **Object Storage (S3/GCS)**: Stores the actual photo files and thumbnails durably and cheaply at massive scale, separate from the database.
- **Message Queue**: Decouples thumbnail generation from the upload request so users receive an immediate response while image processing happens asynchronously.
- **Worker Service**: Picks up thumbnail jobs from the queue, generates resized thumbnails from original photos, and uploads them to object storage.

---

## Upload Flow (Step-by-Step)

1. The user selects a photo in the app and taps "Upload."
2. The app sends the photo file to the Load Balancer over HTTPS.
3. The Load Balancer routes the request to an available App Server.
4. The App Server authenticates the user and validates the file (type, size).
5. The App Server generates a unique photo ID and uploads the original photo directly to Object Storage (S3).
6. The App Server writes the photo metadata (photo ID, user ID, timestamp, caption, S3 URL) to the Primary Database.
7. The App Server publishes a "thumbnail job" message to the Message Queue, containing the photo ID and the S3 path of the original photo.
8. The App Server returns a success response to the user immediately — the photo is now visible on their profile.
9. A Worker Service picks up the thumbnail job from the queue.
10. The Worker downloads the original photo from Object Storage, resizes it to produce a 50 KB thumbnail, and uploads the thumbnail to Object Storage at a new path.
11. The Worker updates the photo's metadata in the database with the thumbnail's URL.
12. The thumbnail is now available through the CDN for fast delivery in other users' feeds.

---

## Trade-offs

### Trade-off 1: Pull-based vs. Push-based Feed Generation

**Choice**: We use a pull-based model where feeds are assembled on-demand when a user opens the app, rather than pre-computing (pushing) every follower's feed at upload time.

**Pros**: Simple to implement; no storage overhead for pre-built feeds; works well when users have many followers (no fan-out explosion).

**Cons**: Feed assembly requires a database query on every view, adding latency; new photos may not appear instantly if caching delays refresh.

**Alternative**: A push-based model (fan-out on write) pre-builds each follower's feed when a photo is uploaded, giving instant visibility but requiring massive write amplification for users with millions of followers.

---

### Trade-off 2: Long CDN Cache TTL vs. Short CDN Cache TTL

**Choice**: We use a long TTL (e.g., 24+ hours) for photos and thumbnails on the CDN.

**Pros**: Most requests are served from edge caches, drastically reducing load on origin servers and object storage; users worldwide get very low latency.

**Cons**: If a user deletes or replaces a photo, the old version may remain visible on the CDN until the TTL expires, creating a window of stale or incorrect content.

**Alternative**: A short TTL (e.g., 60 seconds) or active cache invalidation ensures content freshness but increases origin traffic and reduces the CDN's performance benefit.

---

### Trade-off 3: Synchronous vs. Asynchronous Thumbnail Generation

**Choice**: Thumbnails are generated asynchronously via a message queue and worker service.

**Pros**: Upload responses are fast (no waiting for image processing); CPU-intensive resizing is offloaded from app servers to dedicated workers that scale independently.

**Cons**: There is a delay before the thumbnail is available; users viewing their own profile immediately after upload may see a placeholder.

**Alternative**: Generating thumbnails synchronously during upload eliminates the delay but adds 1-3 seconds to every upload and couples image processing to the request path, reducing overall throughput.
