import unittest

from scripts.validate_commerce_routes import contains_adsense_loader_url


class AdSenseLoaderUrlTests(unittest.TestCase):
    def test_accepts_canonical_loader_urls(self) -> None:
        sources = [
            '<script src="https://pagead2.googlesyndication.com/'
            'pagead/js/adsbygoogle.js?client=ca-pub-example"></script>',
            "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
            "HTTPS://PAGEAD2.GOOGLESYNDICATION.COM/"
            "pagead/js/adsbygoogle.js",
        ]
        for source in sources:
            with self.subTest(source=source):
                self.assertTrue(contains_adsense_loader_url(source))

    def test_rejects_domain_substring_bypasses(self) -> None:
        sources = [
            "https://pagead2.googlesyndication.com.evil.example/"
            "pagead/js/adsbygoogle.js",
            "https://pagead2.googlesyndication.com@evil.example/"
            "pagead/js/adsbygoogle.js",
            "https://evil.example/pagead2.googlesyndication.com/"
            "pagead/js/adsbygoogle.js",
            "https://evil-pagead2.googlesyndication.com/"
            "pagead/js/adsbygoogle.js",
        ]
        for source in sources:
            with self.subTest(source=source):
                self.assertFalse(contains_adsense_loader_url(source))

    def test_rejects_other_paths_on_the_same_host(self) -> None:
        self.assertFalse(
            contains_adsense_loader_url(
                "https://pagead2.googlesyndication.com/pagead/other.js"
            )
        )


if __name__ == "__main__":
    unittest.main()
