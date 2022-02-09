<?php

namespace CKMK\Symfony\Doctrine\EntityPropertyType\Schedule;

use DateTime;
use Exception;

class TimesSchedule {


    private ?DaySchedule $day;

    private ?DateTime $from;

    private ?DateTime $to;

    /**
     * @param DaySchedule $day
     * @param array $times
     * @throws Exception
     */
    public function __construct(DaySchedule $day, array $times)
    {
        $this->day = $day;
        $this->from = new DateTime($times["from"]);
        $this->to = new DateTime($times["to"]);
    }

    /**
     * @return DaySchedule|null
     */
    public function getDay(): ?DaySchedule
    {
        return $this->day;
    }

    /**
     * @return DateTime|null
     */
    public function getFrom(): ?DateTime
    {
        return $this->from;
    }

    /**
     * @return DateTime|null
     */
    public function getTo(): ?DateTime
    {
        return $this->to;
    }

    /**
     * @param $times
     * @return bool
     */
    public static function isValid($times): bool
    {
        $rg = "/^(1[0-9]|2[0-3]|(0)?[0-9]):[0-5]?[0-9](:[0-5]?[0-9])?$/";
        return \preg_match($rg, ($times["from"])) && \preg_match($rg, ($times["to"]));
    }


}