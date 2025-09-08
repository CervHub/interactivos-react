<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->group(function () {
    Route::get('games/slots', function () {
        return Inertia::render('game/slots');  //resources\js\pages\game\slots.tsx
    })->name('game.slots');
});
