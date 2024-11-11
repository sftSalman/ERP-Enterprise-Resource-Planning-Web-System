<?php

namespace App\Enum;

enum Status
{
    public const PENDING = 'pending';
    public const CREATING = 'creating';
    public const APPROVED = 'approved';
    public const REJECTED = 'rejected';
    public const DELETED = 'deleted';
    public const SUBMITTED = 'submitted';
    public const EXPIRED = 'expired';
    public const COMPLETED = 'completed';
    public const PRINT = 'print';
    public const INACTIVE = 'inactive';
    public const CANCELLED = 'cancelled';
    public const ACTIVE = 'active';
}
