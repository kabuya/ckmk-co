<?php

namespace CKMK\Symfony\Doctrine\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Exception;

class RoleNameType extends Type {


    const NAME = 'role_name'; // modify to match your type name


    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getVarcharTypeDeclarationSQL($column);
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     * @throws Exception
     */
    public function convertToPHPValue($value, AbstractPlatform $platform): ?string
    {
        return $value;
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     * @throws Exception
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        if($value && \preg_match("/^[a-z0-9_]+$/i", $value)) {
            if(!\preg_match("/^role_/i", $value)) $value = "role_{$value}";
            return \mb_strtoupper($value);
        }
        return null;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return self::NAME;
    }

}