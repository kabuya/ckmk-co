<?php

namespace CKMK\Symfony\Doctrine\EntityPropertyType\Schedule;

use Exception;

class DaySchedule {


    private ?SchedulePropertyType $schedule;

    private ?string $day;

    private TimesSchedule $times;

    /**
     * @param SchedulePropertyType $schedule
     * @param string $day
     * @param array $times
     * @throws Exception
     */
    public function __construct(
        SchedulePropertyType $schedule,
        string $day,
        array $times
    )
    {
        $this->schedule = $schedule;
        $this->day = \mb_strtolower($day);
        $this->times = new TimesSchedule($this, $times);
    }

    /**
     * @return SchedulePropertyType
     */
    public function getSchedule(): SchedulePropertyType
    {
        return $this->schedule;
    }

    /**
     * @return string
     */
    public function getDay(): string
    {
        return $this->day;
    }

    /**
     * @return TimesSchedule
     */
    public function getTimes(): TimesSchedule
    {
        return $this->times;
    }

    /**
     * @param $day
     * @param $times
     * @return bool
     */
    public static function isValid($day, $times): bool
    {
        return \in_array(\mb_strtolower((string)$day), SchedulePropertyType::DAYS) && TimesSchedule::isValid($times);
    }

}