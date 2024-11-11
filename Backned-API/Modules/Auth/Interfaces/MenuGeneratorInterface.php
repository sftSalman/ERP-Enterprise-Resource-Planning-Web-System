<?php

namespace Modules\Auth\Interfaces;

interface MenuGeneratorInterface
{
    public function generate(): self;
    public function get(): array;
}
