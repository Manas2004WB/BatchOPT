export const batches = [
  {
    batch_id: 1,
    sku_version_id: 101, // FK -> sku_versions
    batch_code: "BATCH-001-A",
    batch_size: 120.5,
    batch_status_id: 1, // FK -> batch_statuses (e.g., 1 = Active)
    created_at: "2025-07-01T10:00:00Z",
    created_by: 1, // FK -> users
    updated_at: "2025-07-01T10:00:00Z",
    updated_by: 1, // FK -> users
  },
  {
    batch_id: 2,
    sku_version_id: 101,
    batch_code: "BATCH-001-B",
    batch_size: 130.0,
    batch_status_id: 2, // e.g., 2 = Inactive
    created_at: "2025-07-03T14:30:00Z",
    created_by: 2,
    updated_at: "2025-07-03T15:00:00Z",
    updated_by: 2,
  },
  {
    batch_id: 3,
    sku_version_id: 102,
    batch_code: "BATCH-002-A",
    batch_size: 95.75,
    batch_status_id: 1,
    created_at: "2025-07-05T09:15:00Z",
    created_by: 3,
    updated_at: "2025-07-05T09:30:00Z",
    updated_by: 3,
  },
  {
    batch_id: 4,
    sku_version_id: 103,
    batch_code: "BATCH-003-A",
    batch_size: 110.2,
    batch_status_id: 3, // e.g., 3 = Pending QA
    created_at: "2025-07-10T08:45:00Z",
    created_by: 2,
    updated_at: "2025-07-10T09:00:00Z",
    updated_by: 2,
  },
  {
    batch_id: 5,
    sku_version_id: 103,
    batch_code: "BATCH-003-B",
    batch_size: 150.0,
    batch_status_id: 1,
    created_at: "2025-07-12T12:00:00Z",
    created_by: 1,
    updated_at: "2025-07-12T12:30:00Z",
    updated_by: 1,
  },
];
