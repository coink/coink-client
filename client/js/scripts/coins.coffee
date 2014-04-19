currencies = ["Ł", "Ᵽ", "Ɖ", "ℕ", "Ψ", "B⃦"]

viewport = ->
	w = window
	d = document
	e = d.documentElement
	g = d.getElementsByTagName("body")[0]
	x = w.innerWidth || e.clientWidth || g.clientWidth
	y = w.innerHeight|| e.clientHeight|| g.clientHeight
	{x, y}

rand = (min, max) ->
	min + Math.floor Math.random() * (max - min + 1)

window.addEventListener "load", ->
	
	genCoin = (coin) ->
		
		time = rand 3, 10
		size = rand 1, 10
		
		dispX = rand -500, 600
		dispY = rand -500, 600
		
		top = rand -100, viewport().y - 200
		left = rand -100, viewport().x - 200
		
		unless coin
			coin = document.createElement "div"
			document.getElementById("background").appendChild coin
			
			coin.addEventListener "webkitAnimationEnd", -> genCoin this
			coin.addEventListener "MSAnimationEnd", -> genCoin this
			coin.addEventListener "oanimationend", -> genCoin this
			coin.addEventListener "animationend", -> genCoin this

		coin.style.top = "#{top}px"
		coin.style.left = "#{left}px"
		coin.className = "time#{time}"
		coin.innerHTML = currencies[rand 0, currencies.length - 1]
		
		window.setTimeout ->
			coin.className += " show"
			coin.style.oTransform = "translate(#{dispX}px, #{dispY}px)"
			coin.style.msTransform = "translate(#{dispX}px, #{dispY}px)"
			coin.style.mozTransform = "translate(#{dispX}px, #{dispY}px)"
			coin.style.webkitTransform = "translate(#{dispX}px, #{dispY}px)"
			coin.style.transform = "translate(#{dispX}px, #{dispY}px)"
		, 10
	
	k = Math.floor(viewport().x * viewport().y / 70000);

	for i in [1..k]
		window.setTimeout genCoin, i * 83
		
	for i in [1..k/2]
		window.setTimeout genCoin, i * 727