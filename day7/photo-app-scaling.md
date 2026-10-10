# SnapShare — Scaling Plan

## Assumptions

| Parameter | Value |
|---|---|
| Registered users | 10,000,000 (10 million) |
| Daily active users (DAU) | 10% of registered = **1,000,000** (1 million) |
| Photos uploaded per active user per day | 1 |
| Feed pages viewed per active user per day | 50 |
| Average photo size | 2 MB |
| Average thumbnail size | 50 KB (0.05 MB) |
| Peak-to-average ratio | 5× |
| Days per year | 365 |

---

## Capacity Estimates

### Daily Active Users (DAU)

```
DAU = 10,000,000 × 10% = 1,000,000 users/day
```

### Uploads Per Second

```
Uploads per day = 1,000,000 users × 1 photo = 1,000,000 photos/day
Uploads per second = 1,000,000 / 86,400 ≈ 11.6 uploads/sec
```

### Feed Views Per Second

```
Feed views per day = 1,000,000 users × 50 views = 50,000,000 views/day
Average views per second = 50,000,000 / 86,400 ≈ 579 views/sec
Peak views per second (5×) = 579 × 5 ≈ 2,894 views/sec
```

### Photo Storage Per Year

```
Storage per photo (original + thumbnail) = 2 MB + 0.05 MB = 2.05 MB
Photos per year = 1,000,000 × 365 = 365,000,000 photos
Storage per year = 365,000,000 × 2.05 MB = 748,250,000 MB
              ≈ 730,713 GB
              ≈ 714 TB per year
```

---

## Read-Heavy vs. Write-Heavy

**SnapShare is a read-heavy system.**

The ratio of reads to writes is approximately:

```
579 views/sec ÷ 11.6 uploads/sec ≈ 50:1
```

For every write (upload), there are roughly 50 reads (feed views). This means the system must be optimized for serving content quickly to many users, not for ingesting data. Key design implications:

- **Caching** is critical — most feed views will hit cache rather than the database.
- **Read replicas** should be used to distribute read load across multiple database copies.
- **CDN** should serve photo files directly to users, bypassing the application servers entirely.
- **Write path** can be slightly slower because writes are infrequent relative to reads.

---

## Why Photos Should NOT Be Stored in the Database

Storing large binary files (BLOBs) inside a relational database is a bad practice at scale because:

1. **Databases are optimized for structured data**, not large binary objects. Storing 2 MB files bloats the database, slows down queries, and wastes expensive database storage.
2. **Databases don't scale horizontally as easily** as object storage for large files.
3. **Serving files from a database** ties up database connections and CPU, competing with metadata queries.
4. **Backups become enormous** — backing up terabytes of photos through database backup tools is slow and expensive.

**Instead, photos should be stored in Object Storage** (e.g., Amazon S3, Google Cloud Storage, or Azure Blob Storage). Object storage is:
- Designed for large binary files
- Infinitely scalable
- Cheap per GB
- Can be served directly via a CDN
- Separates concerns: the database stores metadata (who uploaded what, when, captions), while object storage holds the actual files.

---

## Architecture Diagram

```
                          ┌─────────────────────────────────────────────────────────────┐
                          │                        USERS (Mobile/Web)                    │
                          └──────────────┬──────────────────────────┬───────────────────┘
                                         │                          │
                              Read requests (feed)        Write requests (upload)
                                         │                          │
                                         ▼                          ▼
                          ┌──────────────────────────┐   ┌──────────────────────┐
                          │          CDN             │   │     Load Balancer     │
                          │  (serves photos &        │   │  (distributes traffic │
                          │   thumbnails to users)   │   │   to app servers)     │
                          └──────────┬───────────────┘   └──────────┬───────────┘
                                     │                              │
                                     │          ┌───────────────────┼───────────────────┐
                                     │          │                   │                   │
                                     │          ▼                   ▼                   ▼
                                     │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
                                     │  │  App Server  │  │  App Server  │  │  App Server  │
                                     │  │    (1)       │  │    (2)       │  │    (N)       │
                                     │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                                     │         │                 │                 │
                                     │         └─────────────────┼─────────────────┘
                                     │                           │
                                     │              ┌────────────┴────────────┐
                                     │              │                         │
                                     │              ▼                         ▼
                                     │  ┌───────────────────┐    ┌───────────────────┐
                                     │  │    Cache Layer     │    │   Message Queue    │
                                     │  │  (Redis/Memcached) │    │  (thumbnail jobs)  │
                                     │  │  feed data, user   │    └─────────┬─────────┘
                                     │  │  sessions, hot data│              │
                                     │  └───────────────────┘              ▼
                                     │                         ┌───────────────────────┐
                                     │                         │   Worker Service       │
                                     │                         │  (generates thumbnails)│
                                     │                         └───────────┬───────────┘
                                     │                                     │
                          ┌──────────┴─────────────────────────────────────┴──────────┐
                          │                                                           │
                          ▼                                                           ▼
              ┌───────────────────────┐                               ┌───────────────────────┐
              │    Object Storage     │                               │      Database          │
              │  (S3 / GCS / Blob)    │                               │  ┌─────────────────┐  │
              │                       │                               │  │   Primary DB     │  │
              │  • Original photos    │                               │  │   (writes)       │  │
              │  • Thumbnails         │                               │  └────────┬────────┘  │
              │                       │                               │           │ replicate │
              └───────────────────────┘                               │  ┌────────┴────────┐  │
                                                                      │  │  Read Replica   │  │
                                                                      │  │  (reads)        │  │
                                                                      │  └─────────────────┘  │
                                                                      └───────────────────────┘
```

---

## Component Descriptions

| Component | Problem It Solves |
|---|---|
| **CDN** | Caches and serves photo files and thumbnails from edge locations close to users, eliminating the need to route every image request back to origin servers and reducing latency dramatically. |
| **Load Balancer** | Distributes incoming API traffic evenly across multiple application servers so no single server is overwhelmed and provides high availability if a server fails. |
| **App Servers** | Handle the application logic — authentication, feed generation, upload processing, and API responses — and can be scaled horizontally by adding more instances. |
| **Cache (Redis/Memcached)** | Stores frequently accessed data (feed contents, user sessions, popular posts) in memory so reads are served in milliseconds instead of hitting the slower database. |
| **Database (Primary)** | Stores structured metadata (user profiles, photo metadata, follower relationships, feed state) and handles all write operations with consistency guarantees. |
| **Database (Read Replica)** | An asynchronous copy of the primary database that handles all read queries (feed lookups, profile views), offloading read traffic from the primary and improving read performance. |
| **Object Storage (S3/GCS)** | Stores the actual photo files and thumbnails durably and cheaply at massive scale, separate from the database, and integrates directly with the CDN for efficient delivery. |
| **Message Queue** | Decouples the upload process from thumbnail generation so the user gets an immediate response while the thumbnail job is processed asynchronously in the background. |
| **Worker Service** | Consumes thumbnail jobs from the queue, downloads the original photo, generates a resized 50 KB thumbnail, and uploads it to object storage — keeping heavy image processing off the main app servers. |

---

## Upload Flow (Step-by-Step)

```
Step 1:  User selects a photo in the app and taps "Upload".

Step 2:  The app sends the photo to the Load Balancer via HTTPS.

Step 3:  The Load Balancer routes the request to an available App Server.

Step 4:  The App Server validates the upload (file type, size limits, authentication).

Step 5:  The App Server generates a unique photo ID and uploads the original photo
         directly to Object Storage (S3).

Step 6:  The App Server writes photo metadata (photo ID, user ID, timestamp, caption,
         S3 URL) to the Primary Database.

Step 7:  The App Server publishes a "thumbnail job" message to the Message Queue
         containing the photo ID and S3 path.

Step 8:  The App Server returns a success response to the user (the photo appears
         in their profile immediately).

Step 9:  A Worker Service picks up the thumbnail job from the queue.

Step 10: The Worker downloads the original photo from Object Storage, resizes it
         to generate a 50 KB thumbnail, and uploads the thumbnail back to
         Object Storage (with a different path/key).

Step 11: The Worker updates the photo metadata in the database with the thumbnail URL.

Step 12: The thumbnail is now available via the CDN for fast delivery to other users'
         feeds.
```

---

## Trade-offs

### Trade-off 1: Eventual Consistency vs. Strong Consistency (Feed Generation)

**Choice:** We use eventual consistency for the feed — when a user uploads a photo, it may take a few seconds before it appears in their followers' feeds.

**Benefit:** The upload path is fast (user gets immediate confirmation), and we avoid locking the database for complex fan-out operations. The system scales well because feed generation can happen asynchronously.

**Cost:** Followers may not see a new photo instantly. In a social app this is usually acceptable, but for time-sensitive content (e.g., breaking news photos), users might notice a delay.

**Alternative:** We could use synchronous fan-out (write to every follower's feed immediately on upload), which gives instant visibility but makes uploads slower and doesn't scale for users with millions of followers.

---

### Trade-off 2: CDN Caching TTL vs. Content Freshness

**Choice:** We cache photos and thumbnails on the CDN with a long TTL (e.g., 24 hours or more).

**Benefit:** The vast majority of photo requests are served from CDN edge caches, dramatically reducing load on origin servers and object storage, and providing very low latency to users worldwide.

**Cost:** If a user deletes a photo or edits their profile, the old version may remain visible on the CDN until the cache expires. This creates a window where stale or deleted content is still accessible.

**Alternative:** We could use a very short TTL (e.g., 60 seconds) or implement cache invalidation on every update. This ensures freshness but increases origin load and reduces the performance benefit of the CDN.

---

### Trade-off 3: Thumbnail Generation — Synchronous vs. Asynchronous

**Choice:** We generate thumbnails asynchronously via a queue and worker.

**Benefit:** The upload response is fast because the user doesn't wait for image processing. Heavy CPU work (resizing) is offloaded from the app servers to dedicated workers that can be scaled independently.

**Cost:** There is a delay between upload and thumbnail availability. If a user views their own profile immediately after uploading, they may see a placeholder or no thumbnail until the worker finishes.

**Alternative:** We could generate thumbnails synchronously during upload. This eliminates the delay but makes uploads slower (adds 1–3 seconds of processing time) and couples image processing to the request path, reducing throughput.
