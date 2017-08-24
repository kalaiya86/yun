<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class DemoTest extends TestCase
{
	/**
     * A basic test example.
     *
     * @return void
     */
	public function testIndexTest()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function testApi()
    {
        $response = $this->json('POST', '/user', ['name' => 'Sally']);

        $response
            ->assertStatus(200)
            ->assertJson([
                'created' => true,
            ]);
            
        // $response
        //     ->assertStatus(200)
        //     ->assertExactJson([
        //         'created' => true,
        //     ]);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->assertTrue(true);
    }

    
}
