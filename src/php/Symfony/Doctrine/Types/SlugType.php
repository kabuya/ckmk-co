<?php

namespace CKMK\Symfony\Doctrine\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Exception;

class SlugType extends Type {

    const NAME = 'slug'; // modify to match your type name

    const SPECIAL_CHARS = [
//        " ", ".", "'", "\"", "/", "$",
//        "!", "(", ")", "#", "&", "?",
        "à", "â", "ä", "á", "ã", "å",
        "î", "ï", "ì", "í",
        "ô", "ö", "ò", "ó", "õ", "ø",
        "ù", "û", "ü", "ú",
        "é", "è", "ê", "ë",
        "ç", "ÿ", "ñ",
        "Â", "Ê", "Î", "Ô", "Û", "Ä", "Ë", "Ï", "Ö", "Ü",
        "À", "Æ", "æ", "Ç", "É", "È", "Œ", "œ", "Ù",
    ];
    const REPLACE_CHARS = [
//    "-", "-", "-", "-", "-", "-",
//    "-", "-", "-", "-", "-", "-",
        "a", "a", "a", "a", "a", "a",
        "i", "i", "i", "i",
        "o", "o", "o", "o", "o", "o",
        "u", "u", "u", "u",
        "e", "e", "e", "e",
        "c", "y", "n",
        "A", "E", "I", "O", "U", "A", "E", "I", "O", "U",
        "A", "AE", "ae", "C", "E", "E", "OE", "oe", "U",
    ];

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
        if($value) {
            $divider = "-";
            // Remove accent
            $value = \str_replace(self::SPECIAL_CHARS, self::REPLACE_CHARS, $value);

            // replace non letter or digits by divider
            $value = \preg_replace('~[^\pL\d]+~u', $divider, $value);

            // transliterate
            $value = \iconv('utf-8', 'us-ascii//TRANSLIT', $value);

            // remove unwanted characters
            $value = \preg_replace('~[^-\w]+~', '', $value);

            // trim
            $value = \trim($value, $divider);

            // remove duplicate divider
            $value = \preg_replace('~-+~', $divider, $value);

            return \mb_strtolower($value);
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