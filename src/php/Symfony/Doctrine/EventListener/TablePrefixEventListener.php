<?php

namespace CKMK\Symfony\Doctrine\EventListener;

use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Mapping\ClassMetadataInfo;
use Exception;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class TablePrefixEventListener
{

    public function __construct(
        private ContainerBagInterface $container
    )
    {
    }

    /**
     * @param LoadClassMetadataEventArgs $eventArgs
     *
     * @return void
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs): void
    {
        $classMetadata = $eventArgs->getClassMetadata();

        if (!$classMetadata->isInheritanceTypeSingleTable() || $classMetadata->getName() === $classMetadata->rootEntityName) {
            $classMetadata->setPrimaryTable([
                'name' => $this->setPrefix($classMetadata->getTableName())
            ]);
        }

        foreach ($classMetadata->getAssociationMappings() as $fieldName => $mapping) {
            if ($mapping['type'] === ClassMetadataInfo::MANY_TO_MANY && $mapping['isOwningSide']) {
                $mappedTableName = $mapping['joinTable']['name'];
                $classMetadata->associationMappings[$fieldName]['joinTable']['name'] = $this->setPrefix($mappedTableName);
            }
        }
    }

    /**
     * @param string $name
     * @return string
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    private function setPrefix(string $name): string
    {
        try {
            $prefix = $this->container->get("table_prefix");
        } catch (Exception $e) {
            $prefix = "tbl_";
        }
        if(!\is_int(\strpos($name, $prefix))) $name = $prefix . $name;
        return $name;
    }

}