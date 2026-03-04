<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Admin-configurable system settings. All percentages, limits, and rules
 * are stored here to avoid hardcoding. Cache for performance.
 */
class Setting extends Model
{
    public const CACHE_KEY = 'aurum_settings';
    public const CACHE_TTL = 3600;

    /** Table uses `key` as primary key, not `id`. */
    protected $primaryKey = 'key';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['key', 'value', 'group'];

    /**
     * Get a setting value by key. Returns default if not set.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $all = self::getAllCached();

        if (! array_key_exists($key, $all)) {
            return $default;
        }

        $value = $all[$key];
        return self::castValue($key, $value);
    }

    /**
     * Set a setting value and clear cache.
     */
    public static function set(string $key, mixed $value, string $group = 'general'): void
    {
        $value = is_array($value) || is_object($value) ? json_encode($value) : (string) $value;
        self::updateOrCreate(['key' => $key], ['value' => $value, 'group' => $group]);
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Get all settings as key => value, cached.
     *
     * @return array<string, string>
     */
    public static function getAllCached(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return self::query()->pluck('value', 'key')->toArray();
        });
    }

    /**
     * Cast known numeric/json keys for use in code.
     */
    protected static function castValue(string $key, ?string $value): mixed
    {
        if ($value === null || $value === '') {
            return null;
        }
        if (str_starts_with($key, 'roi_') || str_ends_with($key, '_percent') || str_ends_with($key, '_usd') || str_ends_with($key, '_days')) {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return $decoded;
            }
            return is_numeric($value) ? (float) $value : $value;
        }
        if (in_array($key, ['withdrawal_allowed_days', 'roi_package_rates'], true)) {
            return json_decode($value, true) ?? $value;
        }
        return $value;
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
