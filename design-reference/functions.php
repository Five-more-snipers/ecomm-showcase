<?php
/**
 * Ecommerce Marketplace functions and definitions
 *
 * @package Ecommerce Marketplace
 */

if ( ! function_exists( 'ecommerce_marketplace_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which runs
 * before the init hook. The init hook is too late for some features, such as indicating
 * support post thumbnails.
 */
function ecommerce_marketplace_setup() {
	global $ecommerce_marketplace_content_width;
	if ( ! isset( $ecommerce_marketplace_content_width ) )
		$ecommerce_marketplace_content_width = 680;

	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'wp-block-styles');
	add_theme_support( 'align-wide' );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'custom-logo', array(
		'height'      => 100,
		'width'       => 100,
		'flex-height' => true,
	) );
	add_theme_support( 'custom-background', array(
		'default-color' => 'ffffff'
	) );
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );
	add_editor_style( 'editor-style.css' );
}
endif; // classic_ecommerce_setup
add_action( 'after_setup_theme', 'ecommerce_marketplace_setup' );

function ecommerce_marketplace_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Blog Sidebar', 'ecommerce-marketplace' ),
		'description'   => __( 'Appears on blog page sidebar', 'ecommerce-marketplace' ),
		'id'            => 'sidebar-1',
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	$ecommerce_marketplace_widget_areas = get_theme_mod('classic_ecommerce_footer_widget_areas', '4');
	for ($ecommerce_marketplace_i=1; $ecommerce_marketplace_i<=$ecommerce_marketplace_widget_areas; $ecommerce_marketplace_i++) {
		register_sidebar( array(
			'name'          => __( 'Footer Widget ', 'ecommerce-marketplace' ) . $ecommerce_marketplace_i,
			'id'            => 'footer-' . $ecommerce_marketplace_i,
			'description'   => '',
			'before_widget' => '<aside id="%1$s" class="ftr-4-box widget-column-4 %2$s">',
			'after_widget'  => '</aside>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		) );
	}

}
add_action( 'widgets_init', 'ecommerce_marketplace_widgets_init' );

add_action( 'wp_enqueue_scripts', 'ecommerce_marketplace_enqueue_styles' );
function ecommerce_marketplace_enqueue_styles() {
	wp_enqueue_style( 'bootstrap-css', esc_url(get_template_directory_uri())."/css/bootstrap.css" );

    $ecommerce_marketplace_parenthandle = 'classic-ecommerce-style'; // This is 'twentyfifteen-style' for the Twenty Fifteen theme.
    $ecommerce_marketplace_theme = wp_get_theme();
    wp_enqueue_style( 'ecommerce-marketplace-style', get_stylesheet_uri(),
        array( $ecommerce_marketplace_parenthandle ),
        $ecommerce_marketplace_theme->get('Version') // this only works if you have Version in the style header
    );
    wp_enqueue_style( $ecommerce_marketplace_parenthandle, esc_url(get_template_directory_uri()) . '/style.css',
        array(),  // if the parent theme code has a dependency, copy it to here
        $ecommerce_marketplace_theme->parent()->get('Version')
    );

    wp_enqueue_style('satisfy', 'https://fonts.googleapis.com/css?family=Satisfy:200,300,400,500,600,700&display=swap');

    wp_enqueue_style('inter', 'https://fonts.googleapis.com/css?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

}

// add_action( 'init', 'ecommerce_marketplace_remove_action');
// function ecommerce_marketplace_remove_action() {
//     remove_action( 'admin_menu','classic_ecommerce_theme_info_menu_link' );
//     remove_action( 'admin_notices','classic_ecommerce_deprecated_hook_admin_notice' );
// }


// customizer css
function ecommerce_marketplace_enqueue_customizer_css() {
    wp_enqueue_style( 'ecommerce_marketplace-customizer-css', get_stylesheet_directory_uri() . '/css/customize-controls.css' );
}
add_action( 'customize_controls_print_styles', 'ecommerce_marketplace_enqueue_customizer_css' );

function ecommerce_marketplace_scripts() {

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

}
add_action( 'wp_enqueue_scripts', 'ecommerce_marketplace_scripts' );

add_action( 'customize_register', 'ecommerce_marketplace_customize_register', 11 );
function ecommerce_marketplace_customize_register() {
	global $wp_customize;
	$wp_customize->remove_section('classic_ecommerce_social_media_section');
	

	

}

// Customizer Section
function ecommerce_marketplace_customizer ( $wp_customize ) {


	$wp_customize->add_setting('ecommerce_marketplace_topbar_location_text',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));
	$wp_customize->add_control('ecommerce_marketplace_topbar_location_text',array(
		'label'	=> esc_html__('Add Location','ecommerce-marketplace'),
		'section'=> 'classic_ecommerce_header_section',
		'type'=> 'text',
	   	'settings' => 'ecommerce_marketplace_topbar_location_text',
	));

	$wp_customize->add_setting('ecommerce_marketplace_topbar_track_text',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));
	$wp_customize->add_control('ecommerce_marketplace_topbar_track_text',array(
		'label'	=> esc_html__('Add Track Text','ecommerce-marketplace'),
		'section'=> 'classic_ecommerce_header_section',
		'type'=> 'text',
	   	'settings' => 'ecommerce_marketplace_topbar_track_text',
	));

	$wp_customize->add_setting('ecommerce_marketplace_slider_discount_text',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));
	$wp_customize->add_control('ecommerce_marketplace_slider_discount_text',array(
		'label'	=> esc_html__('Add Discount Text','ecommerce-marketplace'),
		'section'=> 'classic_ecommerce_one_cols_section',
		'type'=> 'text',
	   	'settings' => 'ecommerce_marketplace_slider_discount_text',
	));

	$wp_customize->add_setting('ecommerce_marketplace_slider_subhead_text',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));
	$wp_customize->add_control('ecommerce_marketplace_slider_subhead_text',array(
		'label'	=> esc_html__('Add Sub Heading','ecommerce-marketplace'),
		'section'=> 'classic_ecommerce_one_cols_section',
		'type'=> 'text',
	   	'settings' => 'ecommerce_marketplace_slider_subhead_text',
	));

	$wp_customize->add_setting('ecommerce_marketplace_product_btn_text',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));
	$wp_customize->add_control('ecommerce_marketplace_product_btn_text',array(
		'label'	=> esc_html__('Add Button Text','ecommerce-marketplace'),
		'section'=> 'classic_ecommerce_two_cols_section',
		'type'=> 'text',
	   	'settings' => 'ecommerce_marketplace_product_btn_text',
	));

	$wp_customize->add_setting('ecommerce_marketplace_product_btn_url',array(
		'default'=> '',
		'sanitize_callback'	=> 'sanitize_text_field'
	));
	$wp_customize->add_control('ecommerce_marketplace_product_btn_url',array(
		'label'	=> esc_html__('Add Button URL','ecommerce-marketplace'),
		'section'=> 'classic_ecommerce_two_cols_section',
		'type'=> 'text',
	   	'settings' => 'ecommerce_marketplace_product_btn_url',
	));

}
add_action( 'customize_register', 'ecommerce_marketplace_customizer', 11 );



if ( ! function_exists( 'classic_ecommerce_the_custom_logo' ) ) :
	/**
	 * Displays the optional custom logo.
	 *
	 * Does nothing if the custom logo is not available.
	 *
	 * @since ecommerce-marketplace
	 */
	function classic_ecommerce_the_custom_logo() {
		if ( function_exists( 'the_custom_logo' ) ) {
			// Check if custom logo is set via the customizer
			if ( has_custom_logo() ) {
				the_custom_logo();
			}
		}
	}
endif;


function ecommerce_marketplace_setup_theme() {
	if ( ! defined( 'CLASSIC_ECOMMERCE_PRO_NAME' ) ) {
		define( 'CLASSIC_ECOMMERCE_PRO_NAME', __( 'About Ecommerce Marketplace', 'ecommerce-marketplace' ));
	}
	if ( ! defined( 'CLASSIC_ECOMMERCE_THEME_PAGE' ) ) {
	define('CLASSIC_ECOMMERCE_THEME_PAGE',__('https://www.theclassictemplates.com/collections/best-WordPress-templates','ecommerce-marketplace'));
	}
	if ( ! defined( 'CLASSIC_ECOMMERCE_SUPPORT' ) ) {
	define('CLASSIC_ECOMMERCE_SUPPORT',__('https://WordPress.org/support/theme/ecommerce-marketplace','ecommerce-marketplace'));
	}
	if ( ! defined( 'CLASSIC_ECOMMERCE_REVIEW' ) ) {
	define('CLASSIC_ECOMMERCE_REVIEW',__('https://WordPress.org/support/theme/ecommerce-marketplace/reviews/','ecommerce-marketplace'));
	}
	if ( ! defined( 'CLASSIC_ECOMMERCE_PRO_DEMO' ) ) {
	define('CLASSIC_ECOMMERCE_PRO_DEMO',__('https://live.theclassictemplates.com/demo/classic-ecommerce','ecommerce-marketplace'));
	}
	if ( ! defined( 'CLASSIC_ECOMMERCE_PREMIUM_PAGE' ) ) {
	define('CLASSIC_ECOMMERCE_PREMIUM_PAGE',__('https://www.theclassictemplates.com/products/WordPress-ecommerce-template','ecommerce-marketplace'));
	}
	if ( ! defined( 'CLASSIC_ECOMMERCE_THEME_DOCUMENTATION' ) ) {
	define('CLASSIC_ECOMMERCE_THEME_DOCUMENTATION',__('https://live.theclassictemplates.com/demo/docs/ecommerce-marketplace-free/','ecommerce-marketplace'));
	}
	if ( ! defined( 'CLASSIC_ECOMMERCE_BUNDLE_PAGE' ) ) {
		define('CLASSIC_ECOMMERCE_BUNDLE_PAGE',__('https://www.theclassictemplates.com/products/WordPress-theme-bundle','ecommerce-marketplace'));
	}
	// Footer Link
	define('ECOMMERCE_MARKETPLACE_FOOTER_LINK',__('https://www.theclassictemplates.com/products/ecommerce-marketplace','ecommerce-marketplace'));

}
add_action( 'after_setup_theme', 'ecommerce_marketplace_setup_theme' );