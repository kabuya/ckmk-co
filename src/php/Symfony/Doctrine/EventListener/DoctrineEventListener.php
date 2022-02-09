<?php

namespace CKMK\Symfony\Doctrine\EventListener;

use CKMK\Symfony\Translation\ManageTranslation;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactoryInterface;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class DoctrineEventListener
{

    public function __construct(
        private ContainerBagInterface $container,
        private PasswordHasherFactoryInterface $passwordHasher,
        private ManageTranslation $translation
    )
    {
    }

    public function getContainer(): ContainerBagInterface
    {
        return $this->container;
    }

    public function getPasswordHasher(): PasswordHasherInterface
    {
        return $this->passwordHasher->getPasswordHasher(PasswordAuthenticatedUserInterface::class);
    }

    public function getTranslator(): ManageTranslation
    {
        return $this->translation;
    }

}