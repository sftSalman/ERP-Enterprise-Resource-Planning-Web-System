<?php

namespace App\Traits;

use NumberFormatter;

trait MoneyFormatterTrait
{
    public function formatCurrency($value, $isSymbol = true): string
    {
        $currencySymbol = '';
        $currencyCode = 'BDT';

        switch ($currencyCode) {
            case 'BDT':
                $currencySymbol = '৳';
                break;
            default:
                $currencySymbol = '';
        }

        $formatter = new NumberFormatter('en-US', NumberFormatter::CURRENCY);
        // $formatter->setCurrencyCode($currencyCode);
        $formatter->setSymbol(NumberFormatter::CURRENCY_SYMBOL, $currencySymbol);
        $formatter->setAttribute(NumberFormatter::MIN_FRACTION_DIGITS, 2);
        $formatter->setAttribute(NumberFormatter::MAX_FRACTION_DIGITS, 2);

        if (is_numeric($value)) {
            $formattedValue = $formatter->format($value);
        } else {
            $formattedValue = $formatter->format(0);
        }

        if ($isSymbol) {
            $formattedValue = str_replace($currencyCode, $currencySymbol, $formattedValue);
        }

        return $formattedValue;
    }
}
