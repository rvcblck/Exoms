<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $primaryKey = 'partner_id';
    public $incrementing = false;

    protected $fillable = [
        'contract_id',
        'partner_id',
        'contract_id',
        'start_date',
        'end_date',
        'archived'
    ];


    public function partner()
    {
        return $this->belongsTo(Partner::class,'partner_id');
    }


}
