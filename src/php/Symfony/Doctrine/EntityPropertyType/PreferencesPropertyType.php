<?php

namespace CKMK\Symfony\Doctrine\EntityPropertyType;


class PreferencesPropertyType {

    private array $data;

    public function __construct(array|null $data = null)
    {
        $this->data = $data ?? [];
    }

    /**
     * @param string $key
     * @param mixed $value
     * @return $this
     */
    public function set(string $key, mixed $value): self
    {
        $this->data[$key] = $value;
        return $this;
    }

    /**
     * @param string $key
     * @param mixed|null $default
     * @return mixed
     */
    public function get(string $key, mixed $default = null): mixed
    {
        return ($this->data[$key] ?? $default);
    }

    /**
     * @param string $key
     * @return bool
     */
    public function remove(string $key): bool
    {
        unset($this->data[$key]);
        return true;
    }

    /**
     * @return string
     */
    public function getJson(): string
    {
        return ($json = (string)(@\json_encode($this->data, JSON_UNESCAPED_UNICODE)))
            ? $json
            : "{}"
        ;
    }

    /**
     * @return array
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @param $value
     * @return static|null
     */
    public static function toInstance($value): ?self
    {
        if(\is_string($value) && $value) {
            $value = \preg_replace("/^preferences\(/i", "", $value);
            $value = \preg_replace("/\)$/i", "", $value);
            $value = @\json_decode($value, 512, JSON_UNESCAPED_UNICODE);
            if(\is_array($value)) return new self($value);
        }
        return null;
    }

}