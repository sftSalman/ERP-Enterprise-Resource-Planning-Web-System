<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait FileUploaderTrait
{
    public function uploadFile(
        ?UploadedFile $file,
        string $path,
        string $name = null,
        bool $appendTime = true,
        bool $appendAfter = true
    ): ?string {
        if (empty($file)) {
            return null;
        }

        $fileName = "";

        if ($appendTime && !$appendAfter) {
            $fileName .= time() . '-';
        }

        if (!empty($name)) {
            $fileName .= Str::substr($name, 0, 80);
        } else {
            $fileName .= Str::substr(Str::slug($file->getClientOriginalName()), 0, 80);
        }

        if ($appendTime && $appendAfter) {
            $fileName .= '-' . time();
        }

        $fileName .= '.' . $file->getClientOriginalExtension();

        try {
            $file->storePubliclyAs($path, $fileName);

            return $fileName;
        } catch (\Exception $exception) {
            return null;
        }
    }

    public function deleteFile(string $path, string $fileName): bool
    {
        try {
            if (!empty($fileName) && Storage::exists($path . $fileName)) {
                return Storage::delete($path . $fileName);
            }
        } catch (\Throwable $th) {
            Log::error('Storage item could not be deleted.');
        }

        return false;
    }
}
