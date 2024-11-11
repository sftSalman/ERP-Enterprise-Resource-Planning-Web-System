<?php

namespace App\Helpers;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Base64Encoder
{

    /**
     * Upload Base64 As Image
     *
     * @param string $requestImage Image file as Base 64 format
     * @param string $targetPath
     * @param string $fileName
     * @param string $subName  like for profiling, param data will be profile
     * @return string $imageOutput as output image name
     */
    public static function uploadBase64AsImage($requestImage, $targetPath, $fileName = null, $subName = null)
    {
        $folderPath     = $targetPath;
        $image_parts    = explode(";base64,", $requestImage);
        if (!isset($image_parts[0])) {
            return null;
        }
        $image_type_aux = explode("image/", $image_parts[0]);
        if (!isset($image_type_aux[1])) {
            return null;
        }

        $image_type     = $image_type_aux[1];
        $fileName       = trim(Str::substr(Str::slug($fileName), 0, 20));
        if (!isset($image_parts[1])) {
            return null;
        }
        $image_base64   = base64_decode($image_parts[1]);

        if (is_null($fileName)) {
            $fileName = $subName . '-' . uniqid() . '-' . time();
        } else {
            $fileName = $subName . '-' . $fileName . '-' . time();
        }

        $imageOutput = $folderPath . $fileName . '.' . $image_type;
        // file_put_contents($imageOutput, $image_base64);
        Storage::put($imageOutput, $image_base64);
        return $fileName . '.' . $image_type;
    }


    /**
     * Upload Base64 As Image
     *
     * @param string $requestImage Image file as Base 64 format
     * @param string $targetPath
     * @param string $fileName
     * @param string $subName  like for profiling, param data will be profile
     * @return string $imageOutput as output image name
     */
    public static function uploadBase64File($requestImage, $targetPath, $fileName = null, $subName = null)
    {
        try {
            $folderPath   = $targetPath;
            $image_parts  = explode(";base64,", $requestImage);
            $type         = explode(";", $requestImage);
            $extension    = explode("/", $type[0])[1];
            $fileName     = trim(Str::substr(Str::slug($fileName), 0, 20));
            $image_base64 = base64_decode($image_parts[1]);

            if (is_null($fileName)) {
                $fileName = $subName . '-' . uniqid() . '-' . time();
            } else {
                $fileName = $subName . '-' . $fileName . '-' . time();
            }

            $imageOutput = $folderPath . $fileName . '.' . $extension;
            $uploaded    = Storage::put($imageOutput, $image_base64, 'public');
            $image_name  = $fileName . '.' . $extension;

            if ($uploaded) {
                return $image_name;
            } else {
                throw new Exception("Error Uploading Image. Please try again later.", 500);
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    /**
     * Upload Base64 As Image
     *
     * @param string $requestImage Image file as Base 64 format
     * @param string $targetPath
     * @param string $fileName
     * @param string $subName  like for profiling, param data will be profile
     * @return string $imageOutput as output image name
     */
    public static function updateBase64File($requestImage, $targetPath, $fileName = null, $subName = null)
    {
        if (!is_null($fileName)) {
            // Delete the images first
            if (Storage::exists($targetPath . $fileName)) {
                Storage::delete($targetPath . $fileName);
            }
        }
        $fileName = 'image-' . time() . '-' . uniqid();

        $folderPath   = $targetPath;
        $image_parts  = explode(";base64,", $requestImage);
        $type         = explode(";", $requestImage); //data:image/jpeg
        $extension    = explode("/", $type[0])[1] ?? 'png';
        // return $extension;
        $fileName     = trim(Str::substr(Str::slug($fileName), 0, 20));

        $image_base64 = base64_decode($image_parts[1]);

        if (is_null($fileName)) {
            $fileName = $subName . '-' . uniqid() . '-' . time();
        } else {
            $fileName = $subName . '-' . $fileName . '-' . time();
        }

        $imageOutput = $folderPath . $fileName . '.' . $extension;
        $uploaded    = Storage::put($imageOutput, $image_base64);

        if ($uploaded) {
            return $fileName . '.' . $extension;
        } else {
            throw new Exception("Error Uploading Image. Please try again later.", 500);
        }
    }
}
