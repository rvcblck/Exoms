<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $primaryKey = 'program_id';
    public $incrementing = false;


    protected $fillable = ['position_id', 'program_id', 'position', 'name', 'archived'];



    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }
}
