<div class="flex h-[99vh] w-full items-center justify-center !overflow-hidden">
	<div class="prose relative text-primary">
		<div class="container flex items-center justify-center">
			<div class="glitch" data-text="404">404</div>
			<div class="glow">404</div>
		</div>
		<div class="scanlines"></div>
		<div class="content relative z-10">
			<h1 class="text-center text-primary">Lost in the Multiverse?</h1>
			<p>
				oh no, variant! you've slipped out of the Sacred Timeline™ and landed in a void where this
				page doesn't exist. somewhere in the multiverse, the version you're looking for might be
				real—but not here.
			</p>
			<h3 class="text-primary">what can you do now?</h3>

			<ol>
				<li>call a TVA agent to prune this detour. (just kidding... or are we?)</li>
				<li>
					retrace your steps back to a <a
						class="font-medium text-primary underline underline-offset-2"
						href="/app">safe branch.</a
					>
				</li>
				<li>try a different timeline—preferably one without a Loki haha.</li>
			</ol>
		</div>
	</div>
</div>

<style lang="scss">
	.glitch {
		color: white;
		position: relative;
		font-size: 10vw;
		font-weight: bold;
		animation: glitch 5s 5s infinite;
	}

	.glitch::before {
		content: attr(data-text);
		padding-left: 5%;
		padding-right: 5%;
		margin-top: 0px;
		margin-bottom: 0px;
		position: absolute;
		left: -2px;
		text-shadow: -5px 0 #e77b2f;
		background: #e77c2fd6;
		overflow: hidden;
		top: 0;
		animation:
			noise-1 3s linear infinite alternate-reverse,
			glitch 5s 5.05s infinite;
	}

	.glitch::after {
		content: attr(data-text);
		padding-left: 5%;
		padding-right: 5%;
		margin-top: 0px;
		margin-bottom: 0px;
		position: absolute;
		left: 2px;
		text-shadow: -5px 0 #e77b2f;
		background: #e77c2f84;
		overflow: hidden;
		top: 0;
		animation:
			noise-2 3s linear infinite alternate-reverse,
			glitch 5s 5s infinite;
	}

	@keyframes glitch {
		1% {
			transform: rotateX(10deg) skewX(90deg);
		}
		2% {
			transform: rotateX(0deg) skewX(0deg);
		}
	}

	@keyframes noise-1 {
		$steps: 30;
		@for $i from 1 through $steps {
			#{percentage($i*(1/$steps))} {
				$top: random(100);
				$bottom: random(101 - $top);
				clip-path: inset(#{$top}px 0 #{$bottom}px 0);
			}
		}
	}

	@keyframes noise-2 {
		$steps: 30;
		@for $i from 0 through $steps {
			#{percentage($i*(1/$steps))} {
				$top: random(100);
				$bottom: random(101 - $top);
				clip-path: inset(#{$top}px 0 #{$bottom}px 0);
			}
		}
	}

	.scanlines {
		overflow: hidden;
		mix-blend-mode: difference;
		position: fixed; /* Cambiado a fixed */
		top: 0;
		left: 0;
		width: 100vw; /* Cambiado a vw */
		height: 100vh; /* Cambiado a vh */
		z-index: 1;
		pointer-events: none; /* Añadido para permitir clicks a través */
	}

	.scanlines::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: repeating-linear-gradient(
			to bottom,
			transparent 0%,
			rgba(255, 255, 255, 0.05) 0.5%,
			transparent 1%
		);
		animation: fudge 7s ease-in-out alternate infinite;
	}

	@keyframes fudge {
		from {
			transform: translate(0px, 0px);
		}
		to {
			transform: translate(0px, 2%);
		}
	}

	.glow {
		@extend .glitch;
		text-shadow: orange;
		color: transparent;
		position: absolute;
		top: 0;
	}

	@keyframes glitch-2 {
		1% {
			transform: rotateX(10deg) skewX(70deg);
		}
		2% {
			transform: rotateX(0deg) skewX(0deg);
		}
	}

	.container {
		position: relative;
		margin-bottom: 2rem;
		z-index: 2;
	}
</style>
