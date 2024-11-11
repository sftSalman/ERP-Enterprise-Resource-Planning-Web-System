<?php

namespace App\Helpers;

use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class ImageUploadHelper
{

    /**
     * Upload an Image.
     *
     * @param  [type] $image           [description]
     * @param  [type] $file            [description]
     * @param  [type] $slug            [description]
     * @param  [type] $target_location [description]
     * @return [type]                  [description]
     */
    public static function upload($image, $file, $name, $target_location)
    {
        if (Request::hasFile($image)) {
            // $filename = $name . '.webp';
            // $location = $target_location . '/' . $filename;

            // // Upload image to storage
            // $img = Image::make($file)->encode('webp');
            // Storage::put($location, $img->getEncoded());

            $filename = $name . '.' . $file->getClientOriginalExtension();
            $location = ($target_location . '/' . $filename);
            Image::make($file)->save($location);

            return $filename;
        }
    }

    public static function update($image, $file, $name, $target_location, $old_location)
    {
        if (Request::hasFile($image)) {
            // $filename = $name . '.webp';

            // if (Storage::exists($target_location . '/' . $old_location)) {
            //     Storage::delete($target_location . '/' . $old_location);
            // }

            // $location = $target_location . '/' . $filename;
            // $img = Image::make($file)->encode('webp');

            // // Uploaded to Storage
            // Storage::put($location, $img->getEncoded());

            $filename = $name . '.' . $file->getClientOriginalExtension();
            if (File::exists($target_location . '/' . $old_location)) {
                File::delete($target_location . '/' . $old_location);
            }

            $location = ($target_location . '/' . $filename);
            Image::make($file)->save($location);
            return $filename;
        }
    }

    /**
     * Delete file links.
     *
     * @param string $target_location
     *
     * @return bool
     */
    public static function delete($target_location)
    {
        if (Storage::exists($target_location)) {
            return Storage::delete($target_location);
        }

        return false;
    }

    /**
     * Resize image and upload
     *
     * @param array $args
     *
     * Example: default args -
     *
     * ```php
     * [
     *       'width'             => 300,
     *       'height'            => 300,
     *       'ext'               => 'webp',
     *       'type'              => null,
     *       'from_image_path'   => null,
     *       'output_image_path' => null,
     *       'resolution'        => 100,
     *       'prefix'            => null
     * ]
     *```
     *
     * @return Exception|string|null
     */
    public static function resizeAndUpload($args = [])
    {
        $defaults = [
            'width'             => 300,
            'height'            => 300,
            'ext'               => 'webp',
            'type'              => null,
            'from_image_path'   => null, // This is the old image path, where the output image would be copied
            'output_image_path' => null,
            'resolution'        => 100,
            'prefix'            => null,  // eg: `short-resolution` for product short resolution image
            'delete_old_path'   => false
        ];

        $args   = array_merge($defaults, $args);
        $prefix = !empty($args['prefix'])  ? $args['prefix'] . '-' : '';

        switch ($args['type']) {
            case 'avatar':
                $image_name                = $prefix . time() . '-' . uniqid() . '.' . $args['ext'];
                $args['from_image_path']   = 'images/products/' . $args['from_image_path'];
                $args['output_image_path'] = 'images/products/';
                break;

            default:
                $image_name = $prefix . time() . '-' . uniqid() . '.' . $args['ext'];
                break;
        }

        try {
            // if (!empty($args['output_image_path']) && Storage::exists($args['from_image_path'])) {
            //     $img = Image::make(Storage::url($args['from_image_path']))
            //         ->resize($args['width'], $args['height']);

            //     // Upload image to storage
            //     Storage::put($args['output_image_path'] . $image_name, $img->stream()->detach());

            //     if ($args['delete_old_path']) {
            //         self::delete($args['from_image_path']);
            //     }

            //     return $image_name;
            // }

            if (!empty($args['output_image_path']) && !empty($args['from_image_path'])) {
                $img = Image::make($args['from_image_path'])->resize($args['width'], $args['height']);
                $img->save($args['output_image_path'] . $image_name, $args['resolution'], $args['ext']);

                if ($args['delete_old_path']) {
                    self::delete('public/' . $args['from_image_path']);
                    self::delete($args['from_image_path']);
                }

                return $image_name;
            }

            return null;
        } catch (Exception $e) {
            // throw new Exception($e->getMessage());
            Log::debug('Image Upload Error:' . $e->getMessage());
            throw new Exception('Somethings went wrong to processing the image. Please upload another image !');
        }
    }

    /**
     * Get file URL for AWS.
     *
     * @param string $file_path
     *
     * @return string
     */
    public static function getFileUrl($file_path)
    {
        return 'https://s3.' . env('AWS_DEFAULT_REGION') . '.amazonaws.com/' . env('AWS_BUCKET') . '/' . $file_path;
    }
}
