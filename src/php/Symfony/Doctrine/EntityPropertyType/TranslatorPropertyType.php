<?php

namespace CKMK\Symfony\Doctrine\EntityPropertyType;

class TranslatorPropertyType {

    public function __construct(
        private string $key,
        private array $data,
        private string $local
    )
    {
    }

    public function __toString(): string
    {
        return ($this->getValue() ?? $this->getKey());
    }

    /**
     * @return bool
     */
    public function isValid(): bool
    {
        return !\is_null($this->getValue());
    }

    /**
     * @return string|null
     */
    public function getValue(): ?string
    {
        return ($this->data[$this->local] ?? null);
    }

    /**
     * @return string
     */
    public function getKey(): string
    {
        return $this->key;
    }

    /**
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @return string
     */
    public function getLocal(): string
    {
        return $this->local;
    }

}