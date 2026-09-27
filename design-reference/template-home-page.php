<?php
/**
 * The Template Name: Home Page
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package Classic Ecommerce
 */

get_header(); ?>

<div id="content">
  <?php
    $classic_ecommerce_hidcatslide = get_theme_mod('classic_ecommerce_hide_categorysec', true);
    $classic_ecommerce_slidersection = get_theme_mod('classic_ecommerce_slidersection');

    if ($classic_ecommerce_hidcatslide && $classic_ecommerce_slidersection) { ?>
    <section id="catsliderarea">
      <div class="catwrapslider">
        <div class="owl-carousel">
          <?php if( get_theme_mod('classic_ecommerce_slidersection',false) ) { ?>
          <?php $classic_ecommerce_queryvar = new WP_Query('cat='.esc_attr(get_theme_mod('classic_ecommerce_slidersection',false)));
            while( $classic_ecommerce_queryvar->have_posts() ) : $classic_ecommerce_queryvar->the_post(); ?>
              <div class="slidesection"> 
                <?php if(has_post_thumbnail()){
                  the_post_thumbnail('full');
                  } else{?>
                  <img src="<?php echo esc_url(get_theme_file_uri()); ?>/images/slider.png" alt="<?php echo esc_attr( 'slider', 'ecommerce-marketplace'); ?>"/>
                <?php } ?>
                <div class="slider-box">
                  <?php if(get_theme_mod('ecommerce_marketplace_slider_discount_text') != ''){ ?>
                    <p class="discount-text"><?php echo esc_html(get_theme_mod('ecommerce_marketplace_slider_discount_text')); ?></p>
                  <?php }?>
                  <?php if(get_theme_mod('ecommerce_marketplace_slider_subhead_text') != ''){ ?>
                    <strong class="subhead-text"><?php echo esc_html(get_theme_mod('ecommerce_marketplace_slider_subhead_text')); ?></strong>
                  <?php }?>
                  <h1><a href="<?php echo esc_url( get_permalink() );?>"><?php the_title(); ?></a></h1>
                  <?php
                    $ecommerce_marketplace_trimexcerpt = get_the_excerpt();
                    $ecommerce_marketplace_shortexcerpt = wp_trim_words( $ecommerce_marketplace_trimexcerpt, $ecommerce_marketplace_num_words = 10 );
                    echo '<p>' . esc_html( $ecommerce_marketplace_shortexcerpt ) . '</p>'; 
                  ?>
                  <div class="shop-now">
                    <?php 
                    $classic_ecommerce_button_text = get_theme_mod('classic_ecommerce_button_text', 'SHOP NOW');
                    $classic_ecommerce_button_link_slider = get_theme_mod('classic_ecommerce_button_link_slider', ''); 
                    if (empty($classic_ecommerce_button_link_slider)) {
                        $classic_ecommerce_button_link_slider = get_permalink();
                    }
                    if ($classic_ecommerce_button_text || !empty($classic_ecommerce_button_link_slider)) { ?>
                      <?php if(get_theme_mod('classic_ecommerce_button_text', 'SHOP NOW') != ''){ ?>
                        <a href="<?php echo esc_url($classic_ecommerce_button_link_slider); ?>">
                          <?php echo esc_html($classic_ecommerce_button_text); ?>
                            <span class="screen-reader-text"><?php echo esc_html($classic_ecommerce_button_text); ?></span>
                        </a>
                      <?php } ?>
                    <?php } ?>
                  </div>
                </div>
              </div>
            <?php endwhile; wp_reset_postdata(); ?>
          <?php } ?>
        </div>
      </div>
      <div class="clear"></div>
    </section>
  <?php } ?>

 <?php
  $classic_ecommerce_hidcatproduct = get_theme_mod('classic_ecommerce_hidcatproduct', true);

  if ($classic_ecommerce_hidcatproduct != "") { ?>
    <section id="content-creation">
      <div class="container">
        <div id="recent-product">
          <?php if ( get_theme_mod('classic_ecommerce_recent_product_title') != "") { ?>
            <h2><?php echo esc_html(get_theme_mod('classic_ecommerce_recent_product_title','')); ?></h2>
          <?php } ?>
          <?php if ( get_theme_mod('ecommerce_marketplace_product_btn_text') != "" || get_theme_mod('ecommerce_marketplace_product_btn_url') != "") { ?>
            <a href="<?php echo esc_url(get_theme_mod('ecommerce_marketplace_product_btn_url','')); ?>" class="view-btn"><?php echo esc_html(get_theme_mod('ecommerce_marketplace_product_btn_text','')); ?></a>
          <?php } ?>
        </div>

        <?php while ( have_posts() ) : the_post(); ?>
          <?php the_content(); ?>
        <?php endwhile; // end of the loop. ?>
      </div>
    </section>
  <?php } ?>

</div>

<?php get_footer(); ?>