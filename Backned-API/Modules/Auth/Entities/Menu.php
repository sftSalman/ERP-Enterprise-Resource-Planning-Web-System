<?php

namespace Modules\Auth\Entities;

class Menu
{
    private string $title;
    private string $icon;
    private string $url;
    private int $priority;
    private array $subMenu;

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function setIcon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getPriority(): int
    {
        return (int)$this->priority;
    }

    public function setPriority(string $priority): self
    {
        $this->priority = $priority;

        return $this;
    }

    public function getSubMenu(): array
    {
        return $this->subMenu;
    }

    public function setSubMenu(array $subMenu): self
    {
        $this->subMenu = $subMenu;

        return $this;
    }
}
