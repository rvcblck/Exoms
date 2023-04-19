<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $primaryKey = 'participant_id';
    public $incrementing = false;
    protected $table = 'attendance';
    protected $fillable = [
        'attendance_id','participant_id', 'date', 'status','archived'
    ];

    public function participant()
    {
        return $this->belongsTo(Participant::class,'participant_id');
    }

}
