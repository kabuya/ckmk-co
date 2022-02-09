<?php

namespace CKMK\Symfony\Doctrine\Types;

use CKMK\Symfony\Doctrine\EntityPropertyType\TranslatorPropertyType;
use CKMK\Symfony\Doctrine\EventListener\DoctrineEventListener;
use CKMK\Symfony\Translation\ManageTranslation;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;

class TranslationType extends Type {


    const NAME = 'translator'; // modify to match your type name

    private ?ManageTranslation $translation = null;

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getVarcharTypeDeclarationSQL($column);
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return TranslatorPropertyType|null
     */
    public function convertToPHPValue($value, AbstractPlatform $platform): TranslatorPropertyType|null
    {
        return $this->getTranslator($platform)->getPropertyTypeValue($value);
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        if(!$this->getTranslator($platform)->exist((string)$value)) return null;
        return "TRANS_KEY('{$value}')";
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return self::NAME;
    }

    /**
     * @param AbstractPlatform $platform
     * @return ManageTranslation
     */
    private function getTranslator(AbstractPlatform $platform): ManageTranslation
    {
        if(\is_null($this->translation)) {
            /** @var DoctrineEventListener $listenerContainer */
            $listenerContainer = $platform
                ->getEventManager()
                ->getListeners('getAnyDependancy')
                ["_service_app.doctrine_event_listener"] ?? null
            ;
            if($listenerContainer) $this->translation = $listenerContainer->getTranslator();
        }
        return $this->translation;
    }

}