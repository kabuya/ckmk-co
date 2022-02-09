<?php

namespace CKMK\Symfony\Doctrine\EntityPropertyType\Schedule;

use Exception;

class SchedulePropertyType {

    const DAY_MONDAY = "monday";
    const DAY_TUESDAY = "tuesday";
    const DAY_WEDNESDAY = "wednesday";
    const DAY_THURSDAY = "thursday";
    const DAY_FRIDAY = "friday";
    const DAY_SATURDAY = "saturday";
    const DAY_SUNDAY = "sunday";

    const DAYS = [
        self::DAY_MONDAY,
        self::DAY_TUESDAY,
        self::DAY_WEDNESDAY,
        self::DAY_THURSDAY,
        self::DAY_FRIDAY,
        self::DAY_SATURDAY,
        self::DAY_SUNDAY
    ];

    /**
     * @var DaySchedule[]
     */
    private array|null $days;

    /**
     * @param string|array $days
     * @throws Exception
     */
    public function __construct(string|array $days)
    {
        $this->days = [];
        $this->setDays($days);
    }

    /**
     * @return DaySchedule[]
     */
    public function getDays(): array
    {
        return $this->days;
    }

    /**
     * @return string
     */
    public function getHtml(): string
    {
        $html = "<table class='schedule'>";
        $html .= "<thead>";
        $html .= "<td>Day</td>";
        $html .= "<td>From</td>";
        $html .= "<td>To</td>";
        $html .= "</thead>";
        $html .= "<tbody>";
        foreach ($this->days as $day) {
            $html .= "<tr>";
            $html .= "<td>{$day->getDay()}</td>";
            $html .= "<td>{$day->getTimes()->getFrom()->format('H:i:s')}</td>";
            $html .= "<td>{$day->getTimes()->getTo()->format('H:i:s')}</td>";
            $html .= "</tr>";
        }
        $html .= "</tbody></table>";
        return $html;
    }

    /**
     * @return string
     */
    public function getJson(): string
    {
        $data = [];
        foreach (self::DAYS as $day) {
            $daySchedule = $this->days[$day];
            $data[$day] = [
                "from" => $daySchedule->getTimes()->getFrom()->format("H:i:s"),
                "to" => $daySchedule->getTimes()->getTo()->format("H:i:s"),
            ];
        }
        return \json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return bool
     */
    public function isValid(): bool
    {
        return \count($this->days) === 7;
    }

    /**
     * @param $value
     * @return bool
     */
    public static function isValidValue($value): bool
    {
        if($value instanceof self) return true;
        if(!\is_string($value) && !\is_array($value)) return false;
        if(\is_string($value)) $value = @\json_decode($value,true, 512, JSON_UNESCAPED_UNICODE);
        if(!\is_array($value) || \count($value) !== 7) return false;
        $success = true;
        foreach ($value as $day => $times) {
            if(!DaySchedule::isValid($day, $times)) {
                $success = false;
                break;
            }
        }
        return $success;
    }

    /**
     * @param string|array $days
     * @throws Exception
     */
    private function setDays(string|array $days)
    {
        if(\is_string($days)) $days = @\json_decode($days,true, 512, JSON_UNESCAPED_UNICODE);
        if(\is_array($days)) {
            foreach ($days as $day => $times) {
                if(DaySchedule::isValid($day, $times)) {
                    $this->days[\mb_strtolower($day)] = new DaySchedule($this, $day, $times);
                }
            }
        }
    }

}