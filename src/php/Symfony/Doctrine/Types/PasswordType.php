<?php

namespace CKMK\Symfony\Doctrine\Types;

use CKMK\Symfony\Doctrine\EventListener\DoctrineEventListener;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;

class PasswordType extends Type {


    const NAME = 'password'; // modify to match your type name

    private ?PasswordHasherInterface $passwordHasher = null;

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getVarcharTypeDeclarationSQL($column);
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     */
    public function convertToPHPValue($value, AbstractPlatform $platform): ?string
    {
        return $value;
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform): string
    {
        return ($value && ($passwordHasher = $this->getPasswordHasher($platform))->needsRehash($value))
            ? $passwordHasher->hash($value)
            : $value
        ;
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
     * @return PasswordHasherInterface
     */
    private function getPasswordHasher(AbstractPlatform $platform): PasswordHasherInterface
    {
        if(\is_null($this->passwordHasher)) {
            /** @var DoctrineEventListener $listenerContainer */
            $listenerContainer = $platform
                ->getEventManager()
                ->getListeners('getAnyDependancy')
                ["_service_app.doctrine_event_listener"] ?? null
            ;
            if($listenerContainer) $this->passwordHasher = $listenerContainer->getPasswordHasher();
        }
        return $this->passwordHasher;
    }

}