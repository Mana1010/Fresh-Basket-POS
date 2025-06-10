<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function total_sales(Request $request) {
        $total = Invoice::sum('total_amount');
        return response()->json(['stat' => $total], 200);
    }
}
