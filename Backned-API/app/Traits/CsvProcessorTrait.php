<?php

namespace App\Traits;

use Carbon\Carbon;

trait CsvProcessorTrait
{
    public function getArrayFromCsvFile($csvFile, array $columnNames, bool $appendTimestamp = false): array
    {
        $csv = array_map('str_getcsv', file($csvFile));
        $keys = array_shift($csv);
        $processedArray = [];

        foreach ($csv as $row) {
            $data = array_combine($keys, $row);

            $processedData = [];
            foreach ($columnNames as $columnName) {
                $processedData[$columnName] = $data[$columnName] ?? null;
            }

            if ($appendTimestamp) {
                $processedData['created_at'] = Carbon::now()->toDateTimeString();
                $processedData['updated_at'] = Carbon::now()->toDateTimeString();
            }

            $processedArray[] = $processedData;
        }

        return $processedArray;
    }
}
