<?php

namespace CKMK\Symfony\Doctrine\Types;

use CKMK\Symfony\Doctrine\EventListener\DoctrineEventListener;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class CryptType extends Type {


    const NAME = 'crypt'; // modify to match your type name

    private ?ContainerBagInterface $container = null;

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getVarcharTypeDeclarationSQL($column);
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function convertToPHPValue($value, AbstractPlatform $platform): ?string
    {
        if($value) {
            $container = $this->getContainer($platform);
            $app_secret = $container->get("app_secret");
            $components = \explode($app_secret, $value);
            $iv = $components[0] ?? "";
            if(\strlen($iv) === 16) {
                $encrypted = $components[1] ?? "";
                return \openssl_decrypt($encrypted, 'aes-256-cbc', $app_secret, null, $iv);
            }
        }
        return null;
    }

    /**
     * @param mixed $value
     * @param AbstractPlatform $platform
     * @return string|null
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function convertToDatabaseValue($value, AbstractPlatform $platform): ?string
    {
        if($value) {
            $container = $this->getContainer($platform);
            $app_secret = $container->get("app_secret");
            $iv = \substr(\sha1(\mt_rand()), 0, 16);
            $encrypted = \openssl_encrypt($value, 'aes-256-cbc', $app_secret, null, $iv);
            return "{$iv}{$app_secret}{$encrypted}";
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

    /**
     * @param AbstractPlatform $platform
     * @return ContainerBagInterface
     */
    private function getContainer(AbstractPlatform $platform): ContainerBagInterface
    {
        if(\is_null($this->container)) {
            /** @var DoctrineEventListener $listenerContainer */
            $listenerContainer = $platform
                ->getEventManager()
                ->getListeners('getAnyDependancy')
                ["_service_app.doctrine_event_listener"] ?? null
            ;
            if($listenerContainer) $this->container = $listenerContainer->getContainer();
        }
        return $this->container;
    }

}