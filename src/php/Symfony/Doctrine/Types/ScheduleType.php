<?php

namespace CKMK\Symfony\Doctrine\Types;

use CKMK\Symfony\Doctrine\EntityPropertyType\Schedule\SchedulePropertyType;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Exception;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class ScheduleType extends Type {


    const NAME = 'schedule'; // modify to match your type name

    private ?ContainerBagInterface $container = null;

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return "LONGTEXT";
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return SchedulePropertyType|null
     * @throws Exception
     */
    public function convertToPHPValue($value, AbstractPlatform $platform): ?SchedulePropertyType
    {
        if(!$value) return null;
        $value = \preg_replace("/^SCHEDULE_JSON\(/i", "", $value);
        $value = \preg_replace("/\)$/i", "", $value);
        if(SchedulePropertyType::isValidValue($value)) {
            return new SchedulePropertyType($value);
        }
        return null;
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     * @throws Exception
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        if(SchedulePropertyType::isValidValue($value)) {
            if(!\is_object($value)) $value = new SchedulePropertyType($value);
            return "SCHEDULE_JSON({$value->getJson()})";
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