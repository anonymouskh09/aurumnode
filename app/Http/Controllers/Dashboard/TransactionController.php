<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $transactions = $request->user()->transactions()->latest()->limit(50)->get();

        return Inertia::render('Dashboard/Transactions', [
            'transactions' => $transactions,
        ]);
    }
}
