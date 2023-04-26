<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flow extends Model
{
    use HasFactory;

    protected $primaryKey = 'program_id';
    public $incrementing = false;


    protected $fillable = ['flow_id', 'program_id', 'flow', 'description', 'arrangement', 'archived'];



    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }
}
