<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    protected $primaryKey = 'program_id';
    public $incrementing = false;


    protected $fillable = ['participant_id', 'program_id', 'name','archived'];



    public function program()
    {
        return $this->belongsTo(Program::class,'program_id');
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class,'participant_id');
    }

}

