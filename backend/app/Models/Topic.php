<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $primaryKey = 'program_id';
    public $incrementing = false;


    protected $fillable = ['topic_id', 'program_id', 'col_1', 'col_2', 'col_3', 'arrangement', 'position', 'archived'];



    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id');
    }
}
