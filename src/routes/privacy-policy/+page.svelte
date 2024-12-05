<script>
	import Footer from '../(components)/Footer.svelte';
	import Navbar from '../(components)/Navbar.svelte';
</script>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<div class="flex flex-1 justify-center">
		<div class="prose prose-zinc w-1/2 dark:prose-invert">
			<div class="mb-24 mt-16">
				<small class="mb-1 block text-gray-500">05/12/24</small>
				<h1 class="">privacy policy</h1>

				<p>
					welcome to <u>fotovault</u>! this privacy policy explains how we collect, use, and protect
					your information when you use our beta web application designed to help you organize and
					manage your rolls, pictures, and much more. by using fotovault, you agree to the terms
					outlined below.
				</p>
				<h3>1. beta disclaimer</h3>
				<p>
					fotovault is currently in beta. this means that the app is still under development, and as
					such, the security and stability of the app, including the protection of your data, cannot
					be guaranteed. please use fotovault at your own risk and <b
						>avoid storing sensitive or irreplaceable data</b
					>.
				</p>
				<h3>2. information we collect</h3>
				<div>
					<p>we may collect the following types of information when you use Fotovault:</p>
					<ul>
						<li>
							<b>User-Provided Data</b>: information you enter into the app, such as your rolls,
							pictures, and related notes.
						</li>
						<li>
							<b>Automatically Collected Data</b>: non-personal information like browser type,
							operating system, and IP address to improve app performance.
						</li>
					</ul>
				</div>
				<h3>3. how we use your information</h3>
				<div>
					<p>we use the data collected to:</p>
					<ul>
						<li>Provide and maintain the functionality of Fotovault.</li>
						<li>Analyze usage trends to improve the app.</li>
						<li>Communicate with you about updates, changes, or issues related to the app.</li>
					</ul>
				</div>
				<h3>4. data security and integrity</h3>
				<p>
					while we take reasonable measures to protect your data, fotovault is a beta application,
					and its security cannot be fully guaranteed. your information may be vulnerable to
					unauthorized access, loss, or theft.
				</p>
				<h3>5. data sharing</h3>
				<div>
					<p>
						we do not sell, trade, or rent your personal information to third parties. however, we
						may share data:
					</p>
					<ul>
						<li>With service providers that help us operate the app.</li>
						<li>When required by law or to protect our legal rights.</li>
					</ul>
				</div>
				<h3>6. changes to this policy</h3>
				<p>
					we may update this policy from time to time to reflect changes in our practices or for
					legal reasons. we will notify you of significant changes by posting the updated policy on
					this page and updating the effective date above.
				</p>
				<h3>7. contact us</h3>
				<p>
					if you have questions or concerns about this privacy policy, please contact us at:
					<br />
					<b>email:</b> <a href="mailto:admin@fotovault.cc">admin@fotovault.cc</a>
				</p>
			</div>
		</div>
	</div>
	<Footer />
</div>
