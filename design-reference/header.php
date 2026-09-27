<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div class="container">
 *
 * @package Classic Ecommerce
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php if ( function_exists( 'wp_body_open' ) ) {
  wp_body_open();
} else {
  do_action( 'wp_body_open' );
} ?>

<?php if ( get_theme_mod('classic_ecommerce_preloader', false) != "") { ?>
  <div id="preloader">
    <div id="status">&nbsp;</div>
  </div>
<?php } ?>

<a class="screen-reader-text skip-link" href="#content"><?php esc_html_e( 'Skip to content', 'ecommerce-marketplace' ); ?></a>

<div id="pageholder" <?php if( get_theme_mod( 'classic_ecommerce_box_layout', false) != "") { echo 'class="boxlayout"'; } ?>>

<?php if ( get_theme_mod('classic_ecommerce_top_bar', true) != "") { ?>
  <div class="header-top">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-7 align-self-center">
          <p><?php echo esc_html(get_theme_mod ('classic_ecommerce_offer_text','')); ?></p>
        </div>
        <div class="col-lg-4 col-md-5 align-self-center">
          <div class="topbar-text">
            <?php if(get_theme_mod('ecommerce_marketplace_topbar_location_text') != ''){?>
              <p class="location"><i class="fas fa-map-marker-alt me-2"></i><?php echo esc_html(get_theme_mod('ecommerce_marketplace_topbar_location_text')); ?></p>
            <?php }?>
            <?php if(get_theme_mod('ecommerce_marketplace_topbar_track_text') != ''){?>
              <p class="track-text"><i class="fas fa-truck me-2"></i><?php echo esc_html(get_theme_mod('ecommerce_marketplace_topbar_track_text')); ?></p>
            <?php }?>
          </div>
        </div>
      </div>
    </div>
  </div>
<?php } ?>

<div class="header <?php echo esc_attr(classic_ecommerce_sticky_menu()); ?>">
  <div class="container">
    <div class="row">
      <div class="col-lg-3 col-md-8 align-self-center">
        <div class="logo">
          <?php if (get_theme_mod('classic_ecommerce_logo_enable', false)) { ?>
            <?php classic_ecommerce_the_custom_logo(); ?>
          <?php } ?>
          <div class="site-branding-text">
            <?php if ( get_theme_mod('classic_ecommerce_title_enable',true) != "") { ?>
              <?php if ( is_front_page() && is_home() ) : ?>
                <h1 class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a></h1>
              <?php else : ?>
                  <p class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a></p>
                <?php endif; ?>
              <?php } ?>
            <?php $classic_ecommerce_description = get_bloginfo( 'description', 'display' );
            if ( $classic_ecommerce_description || is_customize_preview() ) : ?>
              <?php if ( get_theme_mod('classic_ecommerce_tagline_enable',true) != "") { ?>
              <span class="site-description"><?php echo esc_html( $classic_ecommerce_description ); ?></span>
              <?php } ?>
            <?php endif; ?> 
          </div>
        </div>
      </div>
      <div class="col-lg-9 col-md-4 align-self-center">
        <div class="toggle-nav">
          <?php if (has_nav_menu('primary')) { ?>
            <button role="tab"><?php esc_html_e('MENU','ecommerce-marketplace'); ?></button>
          <?php } ?>
        </div>
        <div id="mySidenav" class="nav sidenav">
          <nav id="site-navigation" class="main-nav" role="navigation" aria-label="<?php esc_attr_e( 'Top Menu','ecommerce-marketplace' ); ?>">
            <ul class="mobile_nav">
              <?php
                wp_nav_menu( array( 
                  'theme_location' => 'primary',
                  'container_class' => 'main-menu' ,
                  'items_wrap' => '%3$s',
                  'fallback_cb' => 'wp_page_menu',
                ) ); 
               ?>
            </ul>
            <a href="javascript:void(0)" class="close-button"><?php esc_html_e('CLOSE','ecommerce-marketplace'); ?></a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</div>
<?php if(class_exists('woocommerce')){ ?>  
  <div class="category-meta">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-3 align-self-center">
          <button class="category-btn"><i class="fa fa-bars" aria-hidden="true"></i><?php echo esc_html(get_theme_mod('classic_ecommerce_category_text','CATEGORIES','ecommerce-marketplace')); ?></button>
          <div class="category-dropdown">
            <?php
              $args = array(
                'number'     => get_theme_mod('classic_ecommerce_product_category_number'),
                'orderby'    => 'title',
                'order'      => 'ASC',
                'hide_empty' => 0,
                'parent'  => 0
              );
              $classic_ecommerce_product_categories = get_terms( 'product_cat', $args );
              $classic_ecommerce_count = count($classic_ecommerce_product_categories);
              if ( $classic_ecommerce_count > 0 ){
                foreach ( $classic_ecommerce_product_categories as $classic_ecommerce_product_category ) {
                  $classic_ecommerce_cat_id   = $classic_ecommerce_product_category->term_id;
                  $cat_link = get_category_link( $classic_ecommerce_cat_id );
                  if ($classic_ecommerce_product_category->category_parent == 0) { ?>
                <li class="drp_dwn_menu"><a href="<?php echo esc_url(get_term_link( $classic_ecommerce_product_category ) ); ?>">
                <?php
              }
                echo esc_html( $classic_ecommerce_product_category->name ); ?></a></li>
                <?php
                }
              }
            ?>
          </div>
        </div>
        <div class="col-lg-7 col-md-7 align-self-center">
          <div class="product-search">
            <?php get_product_search_form(); ?>
          </div>
        </div>
        <div class="col-lg-1 col-md-1 col-6 align-self-center">
          <div class="product-account">
            <?php if ( is_user_logged_in() ) { ?>
              <a href="<?php echo esc_url( get_permalink( get_option('woocommerce_myaccount_page_id') ) ); ?>" title="<?php esc_attr_e('My Account','ecommerce-marketplace'); ?>"><i class="fas fa-sign-in-alt"></i></a>
            <?php } 
            else { ?>
              <a href="<?php echo esc_url( get_permalink( get_option('woocommerce_myaccount_page_id') ) ); ?>" title="<?php esc_attr_e('Login / Register','ecommerce-marketplace'); ?>"><i class="fas fa-user"></i></a>
            <?php } ?>
          </div>  
        </div>
        <div class="col-lg-1 col-md-1 col-6 align-self-center">
          <div class="product-cart">
            <a href="<?php if(function_exists('wc_get_cart_url')){ echo esc_url(wc_get_cart_url()); } ?>" title="<?php esc_attr_e( 'shopping cart','ecommerce-marketplace' ); ?>"><i class="fas fa-shopping-cart"></i></a>
            <span class="item-count"> <?php echo esc_html(wp_kses_data( WC()->cart->get_cart_contents_count()));?></span>
          </div>
        </div>
      </div>
    </div>
  </div>
<?php }?>