module "MyModuleTest", [ "MyModule" ], ( MyModule ) ->
	describe "MyModule", ->
		it "should be awesome", ->
			expect( MyModule.itIsAwesome ).to.equal( true )

load( "MyModuleTest" )
