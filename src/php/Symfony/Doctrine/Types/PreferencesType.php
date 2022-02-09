<?php

namespace CKMK\Symfony\Doctrine\Types;

use CKMK\Symfony\Doctrine\EntityPropertyType\PreferencesPropertyType;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Exception;

class PreferencesType extends Type {

    const NAME = 'preferences'; // modify to match your type name

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return "LONGTEXT";
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return PreferencesPropertyType|null
     * @throws Exception
     */
    public function convertToPHPValue($value, AbstractPlatform $platform): ?PreferencesPropertyType
    {
        return PreferencesPropertyType::toInstance($value);
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     * @throws Exception
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        $json = null;
        if($value instanceof PreferencesPropertyType) {
            $json = $value->getJson();
        } elseif (\is_array($value)) {
            $json = (new PreferencesPropertyType($value))->getJson();
        }
        return "PREFERENCES(". ($json ?? "{}") .")";
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return self::NAME;
    }

}