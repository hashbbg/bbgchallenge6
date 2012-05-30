module "Graphics", [ "Rendering", "Camera", "Vec2" ], ( Rendering, Camera, Vec2 ) ->
	cellSize = 32
	gridSize = 9


	module =
		createRenderState: ->
			renderState =
				renderables: []

		updateRenderState: ( renderState, gameState ) ->
			renderState.renderables.length = 0

			appendGrid(
				gameState.grid,
				renderState.renderables )
			appendSquares(
				gameState.grid,
				renderState.renderables )
			appendNext(
				gameState.next,
				gameState.grid,
				renderState.renderables )
			appendScore(
				gameState.score,
				gameState.grid,
				renderState.renderables )
			appendEndScore(
				gameState.lost,
				gameState.score,
				renderState.renderables )


	appendGrid = ( grid, renderables ) ->
		x = xMin( grid )
		while x <= xMax( grid )
			vertical = Rendering.createRenderable( "line" )
			vertical.resource =
				color: "rgb(255,255,255)"
				start: [ x, yMin( grid ) ]
				end  : [ x, yMax( grid ) ]

			renderables.push( vertical )

			x += cellSize

		y = yMin( grid )
		while y <= yMax( grid )
			horizontal = Rendering.createRenderable( "line" )
			horizontal.resource =
				color: "rgb(255,255,255)"
				start: [ xMin( grid ), y ]
				end  : [ xMax( grid ), y ]

			renderables.push( horizontal )

			y += cellSize

	appendSquares = ( grid, renderables ) ->
		for x in [ 0...grid.length ]
			for y in [ 0...grid[ x ].length ]
				square = grid[ x ][ y ]
				appendSquare(
					x,
					y,
					grid,
					square,
					renderables )

	appendNext = ( next, grid, renderables ) ->
		for square, i  in next.squares
			appendSquare(
				i + next.offset,
				-1,
				grid,
				square,
				renderables )

	appendSquare = ( x, y, grid, square, renderables ) ->
		margin = 2

		unless square == "empty"
			renderable = Rendering.createRenderable( "rectangle" )
			renderable.position = [
				xMin( grid ) + x*cellSize + margin
				yMin( grid ) + y*cellSize + margin ]
			renderable.resource =
				size: [
					cellSize - margin*2
					cellSize - margin*2 ]

			renderable.resource.color = switch square
				when "red"     then "rgb(255,0,0)"
				when "green"   then "rgb(0,255,0)"
				when "blocked" then "rgb(127,127,127)"

			renderables.push( renderable )

	appendScore = ( score, grid, renderables ) ->
		renderable = Rendering.createRenderable( "text" )
		renderable.position = [ 0, yMax( grid ) + 40 ]
		renderable.resource =
			string: "#{ score }"
			textColor: "rgb(255,255,255)"
			centered: [ true, false ]
			font: "32px Monospace"

		renderables.push( renderable )

	appendEndScore = ( lost, score, renderables ) ->
		if lost
			size = [ 440, 150 ]

			position = Vec2.copy( size )
			Vec2.scale( position, -0.5)

			box = Rendering.createRenderable( "rectangle" )
			box.position = position
			box.resource =
				color: "rgb(255,255,255)"
				size : size

			congratulations = Rendering.createRenderable( "text" )
			congratulations.position = [ 0, -30 ]
			congratulations.resource =
				string: "Congratulations!"
				textColor: "rgb(0,0,0)"
				centered: [ true, false ]
				font: "35px Monospace"

			scoreMessage = Rendering.createRenderable( "text" )
			scoreMessage.position = [ 0, 30 ]
			scoreMessage.resource =
				string: "You got #{ score } points!"
				textColor: "rgb(0,0,0)"
				centered: [ true, false ]
				font: "35px Monospace"

			resetMessage = Rendering.createRenderable( "text" )
			resetMessage.position = [ 0, 60 ]
			resetMessage.resource =
				string: "(press enter to reset)"
				textColor: "rgb(0,0,0)"
				centered: [ true, false ]
				font: "20px Monospace"
			 

			renderables.push( box )
			renderables.push( congratulations )
			renderables.push( scoreMessage )
			renderables.push( resetMessage )

	xMin = ( grid ) ->
		-grid.length / 2 * cellSize

	xMax = ( grid ) ->
		grid.length / 2 * cellSize

	yMin = ( grid ) ->
		-grid[ 0 ].length / 2 * cellSize

	yMax = ( grid ) ->
		grid[ 0 ].length / 2 * cellSize


	module
