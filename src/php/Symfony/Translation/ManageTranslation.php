<?php

namespace CKMK\Symfony\Translation;

use CKMK\Symfony\Doctrine\EntityPropertyType\TranslatorPropertyType;
use Exception;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\Translation\MessageCatalogueInterface;
use Symfony\Component\Yaml\Yaml;
use Symfony\Contracts\Translation\TranslatorInterface;


class ManageTranslation {

    use ContainerAwareTrait;

    public function __construct(
        private TranslatorInterface $translator,
        private string $directory = ""
    )
    {
        $this->directory = \dirname(__DIR__, 2) . "/translations/";
    }

    /**
     * @param string $id
     * @param string|null $default
     * @return string|null
     */
    public function transOrDefault(string $id, ?string $default = null): ?string
    {
        return $this->exist($id)
            ? $this->trans($id)
            : $default
        ;
    }

    /**
     * @param string $id
     * @param array $parameters
     * @param string|null $domain
     * @param string|null $locale
     * @return string
     */
    public function trans(string $id, array $parameters = [], string $domain = null, string $locale = null): string
    {
        return $this->translator->trans($id, $parameters, $domain, $locale);
    }

    /**
     * @return string
     */
    public function getLocal(): string
    {
        return $this->translator->getLocale();
    }

    /**
     * @return string[]
     */
    public function getLocals(): array
    {
        return $this->translator->getFallbackLocales();
    }

    /**
     * @param string $key
     * @param array $values
     * @return bool
     * @throws Exception
     */
    public function save(string $key, array $values): bool
    {
        return $this->saveNewItems($key, $values);
    }

    /**
     * @param string $key
     * @param array $values
     * @return bool
     * @throws Exception
     */
    public function saveIfNotExist(string $key, array $values): bool
    {
        return $this->saveNewItems($key, $values, true);
    }

    /**
     * @param string $key
     * @return bool
     */
    public function remove(string $key): bool
    {
        if($this->exist($key)) {
            foreach ($this->scanDirectory() as $file) {
                if(\preg_match("/^messages/i", $file)) {
                    $_locale = \str_replace(["messages.", ".yaml"], "", $file);
                    $_data = $this->getTexts($_locale);
                    unset($_data[(\explode(".", $key)[0] ?? null)]);
                    if(\count($_data)) {
                        $this->putData($_locale, $this->getTextsYaml($_data));
                    } else {
                        \unlink($this->filepath($_locale));
                    }
                }
            }
            return true;
        }
        return false;
    }

    /**
     * @param string $key
     * @return bool
     */
    public function exist(string $key): bool
    {
        /** @var MessageCatalogueInterface $catalogue */
        $catalogue = $this->translator->getCatalogue($this->translator->getLocale());
        return $catalogue->has($key);
    }

    /**
     * @param string $key
     * @return array
     */
    public function getAll(string $key): array
    {
        $data = [];
        if($this->exist($key)) {
            foreach ($this->getLocals() as $local) {
                $data[$local] = $this->translator->getCatalogue($local)->get($key);
            }
        }
        return $data;
    }

    /**
     * @param $value
     * @return TranslatorPropertyType|null
     */
    public function getPropertyTypeValue($value): ?TranslatorPropertyType
    {
        if($value instanceof TranslatorPropertyType) return $value;
        $value = (string)$value;
        $value = \preg_replace("/^TRANS_KEY\('/i", "", $value);
        $value = \preg_replace("/'\)$/i", "", $value);
        return $this->exist($value)
            ? new TranslatorPropertyType($value, $this->getAll($value), $this->getLocal())
            : null
        ;
    }

    /**
     * @param $key
     * @param $textValues
     * @return bool
     */
    public function isValidKeyAndTexts($key, $textValues): bool
    {
        if(!\is_string($key) || !\is_array($textValues)) return false;
        $success = true;
        foreach ($this->getLocals() as $local) {
            if(\is_null($textValues[$local] ?? null)) $success = false;
        }
        return $success;
    }

    /**
     * @param string $key
     * @param array $values
     * @param bool $saveOnlyIfNotExist
     * @return bool
     * @throws Exception
     */
    private function saveNewItems(string $key, array $values, bool $saveOnlyIfNotExist = false): bool
    {
        $this->checkFiles();
        if($saveOnlyIfNotExist && $this->exist($key)) return false;
        foreach ($this->scanDirectory() as $file) {
            if(\preg_match("/^messages/i", $file)) {
                $_locale = \str_replace(["messages.", ".yaml", ".php", ".json"], "", $file);
                if(!isset($values[$_locale]) || \is_null($values[$_locale])) {
                    throw new Exception("You need to defined the text of local {$_locale}");
                }
                $data = $this->addData($key, $values[$_locale], $this->getTexts($_locale));
                $this->putData($_locale, $this->getTextsYaml($data));
            }
        }
        return true;
    }

    /**
     * @param string $key
     * @param string $value
     * @param array $data
     * @param int $currentIndex
     * @return array
     */
    private function addData(
        string $key,
        string $value,
        array $data,
        int $currentIndex = 0
    ): array
    {
        $keys = \explode(".", $key);
        $lastKey = \count($keys) - 1;
        $currentKey = $keys[$currentIndex];
        if($currentIndex === $lastKey) {
            $data[$currentKey] = $value;
        } elseif(\is_array(($subData = ($data[$currentKey] ?? [])))) {
            $data[$currentKey] = $this->addData($key, $value, $subData, ($currentIndex + 1));
        }
        return $data;
    }

    private function scanDirectory(): array
    {
        if($list = \array_diff(\scandir($this->directory), [".gitignore", ".", ".."])) return $list;
        return [];
    }

    /**
     * @return bool
     */
    private function checkFiles(): bool
    {
        if(!\count($this->scanDirectory())) {
            foreach ($this->translator->getFallbackLocales() as $_locale) {
                $this->putData($_locale, "");
            }
        }
        return false;
    }

    private function putData(string $locale, string $data): bool|int
    {
        return \file_put_contents($this->filepath($locale), $data);
    }

    /**
     * @param string $locale
     * @return array
     */
    private function getTexts(string $locale): array
    {
        return Yaml::parseFile($this->filepath($locale)) ?? [];
    }

    private function getTextsYaml(mixed $input, int $inline = 100, int $indent = 4, int $flags = 0): string
    {
        return Yaml::dump($input, $inline, $indent, $flags);
    }

    /**
     * @param string $locale
     * @return string
     */
    private function filename(string $locale): string
    {
        return "messages.{$locale}.yaml";
    }

    /**
     * @param string $locale
     * @return string
     */
    private function filepath(string $locale): string
    {
        return $this->directory . $this->filename($locale);
    }


}