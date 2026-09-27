<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package Ecommerce Marketplace
 */
?>
<div id="footer">
  <?php 
    $ecommerce_marketplace_footer_widget_enabled = get_theme_mod('ecommerce_marketplace_footer_widget', true);
    
    if ($ecommerce_marketplace_footer_widget_enabled !== false && $ecommerce_marketplace_footer_widget_enabled !== '') { ?>

    <?php 
        $ecommerce_marketplace_widget_areas = get_theme_mod('classic_ecommerce_footer_widget_areas', '4');
        if ($ecommerce_marketplace_widget_areas == '3') {
            $ecommerce_marketplace_cols = 'col-lg-4 col-md-6';
        } elseif ($ecommerce_marketplace_widget_areas == '4') {
            $ecommerce_marketplace_cols = 'col-lg-3 col-md-6';
        } elseif ($ecommerce_marketplace_widget_areas == '2') {
            $ecommerce_marketplace_cols = 'col-lg-6 col-md-6';
        } else {
            $ecommerce_marketplace_cols = 'col-lg-12 col-md-12';
        }
    ?>

    <div class="footer-widget">
        <div class="container">
          <div class="row wow bounceInUp delay-3000" data-wow-duration="2s">
            <!-- Footer 1 -->
            <div class="<?php echo esc_attr($ecommerce_marketplace_cols); ?> footer-block">
                <?php if (is_active_sidebar('footer-1')) : ?>
                    <?php dynamic_sidebar('footer-1'); ?>
                <?php else : ?>
                    <aside id="categories" class="widget py-3" role="complementary" aria-label="<?php esc_attr_e('footer1', 'ecommerce-marketplace'); ?>">
                        <h3 class="widget-title"><?php esc_html_e('Categories', 'ecommerce-marketplace'); ?></h3>
                        <ul>
                            <?php wp_list_categories('title_li='); ?>
                        </ul>
                    </aside>
                <?php endif; ?>
            </div>

            <!-- Footer 2 -->
            <div class="<?php echo esc_attr($ecommerce_marketplace_cols); ?> footer-block">
                <?php if (is_active_sidebar('footer-2')) : ?>
                    <?php dynamic_sidebar('footer-2'); ?>
                <?php else : ?>
                    <aside id="archives" class="widget py-3" role="complementary" aria-label="<?php esc_attr_e('footer2', 'ecommerce-marketplace'); ?>">
                        <h3 class="widget-title"><?php esc_html_e('Archives', 'ecommerce-marketplace'); ?></h3>
                        <ul>
                            <?php wp_get_archives(array('type' => 'monthly')); ?>
                        </ul>
                    </aside>
                <?php endif; ?>
            </div>

            <!-- Footer 3 -->
            <div class="<?php echo esc_attr($ecommerce_marketplace_cols); ?> footer-block">
                <?php if (is_active_sidebar('footer-3')) : ?>
                    <?php dynamic_sidebar('footer-3'); ?>
                <?php else : ?>
                    <aside id="meta" class="widget py-3" role="complementary" aria-label="<?php esc_attr_e('footer3', 'ecommerce-marketplace'); ?>">
                        <h3 class="widget-title"><?php esc_html_e('Meta', 'ecommerce-marketplace'); ?></h3>
                        <ul>
                            <?php wp_register(); ?>
                            <li><?php wp_loginout(); ?></li>
                            <?php wp_meta(); ?>
                        </ul>
                    </aside>
                <?php endif; ?>
            </div>

            <!-- Footer 4 -->
            <div class="<?php echo esc_attr($ecommerce_marketplace_cols); ?> footer-block">
                <?php if (is_active_sidebar('footer-4')) : ?>
                    <?php dynamic_sidebar('footer-4'); ?>
                <?php else : ?>
                    <aside id="search-widget" class="widget py-3" role="complementary" aria-label="<?php esc_attr_e('footer4', 'ecommerce-marketplace'); ?>">
                        <h3 class="widget-title"><?php esc_html_e('Search', 'ecommerce-marketplace'); ?></h3>
                        <?php the_widget('WP_Widget_Search'); ?>
                    </aside>
                <?php endif; ?>
            </div>
          </div>
        </div>
    </div>

    <?php } ?>
    <div class="clear"></div>
  <div class="copywrap text-center">
      <div class="footer-bottom">
        <?php $classic_ecommerce_social_links_present = get_theme_mod('classic_ecommerce_footer_facebook_link') || get_theme_mod('classic_ecommerce_footer_instagram_link') || get_theme_mod('classic_ecommerce_footer_pinterest_link') || get_theme_mod('classic_ecommerce_footer_twitter_link') || get_theme_mod('classic_ecommerce_footer_youtube_link'); ?>
        <div class="container copywrap-info <?php echo $classic_ecommerce_social_links_present ? '' : 'center-content'; ?>">
           <p>
            <a href="<?php 
                $classic_ecommerce_copyright_link = get_theme_mod('classic_ecommerce_copyright_link', '');
                if (empty($classic_ecommerce_copyright_link)) {
                    echo esc_url(ECOMMERCE_MARKETPLACE_FOOTER_LINK);
                } else {
                    echo esc_url($classic_ecommerce_copyright_link);
                } ?>" target="_blank">
                <?php echo esc_html(get_theme_mod('classic_ecommerce_copyright_line', __('Ecommerce WordPress Theme', 'ecommerce-marketplace'))); ?>
            </a> 
            <?php echo esc_html('By Classic Templates', 'ecommerce-marketplace'); ?>
          </p>
          <?php if ( $classic_ecommerce_social_links_present ) { ?>
            <div class="footer-social d-flex gap-3">
                <?php if ( get_theme_mod('classic_ecommerce_footer_facebook_link') ) { ?>
                    <a title="<?php echo esc_attr('facebook', 'ecommerce-marketplace'); ?>" target="_blank" href="<?php echo esc_url(get_theme_mod('classic_ecommerce_footer_facebook_link')); ?>"><i class="fab fa-facebook-f"></i></a> 
                <?php } ?>
                <?php if ( get_theme_mod('classic_ecommerce_footer_instagram_link') ) { ?> 
                    <a title="<?php echo esc_attr('instagram', 'ecommerce-marketplace'); ?>" target="_blank" href="<?php echo esc_url(get_theme_mod('classic_ecommerce_footer_instagram_link')); ?>"><i class="fab fa-instagram"></i></a>
                <?php } ?>
                <?php if ( get_theme_mod('classic_ecommerce_footer_pinterest_link') ) { ?>
                    <a title="<?php echo esc_attr('pinterest', 'ecommerce-marketplace'); ?>" target="_blank" href="<?php echo esc_url(get_theme_mod('classic_ecommerce_footer_pinterest_link')); ?>"><i class="fab fa-pinterest"></i></a>
                <?php } ?>
                <?php if ( get_theme_mod('classic_ecommerce_footer_twitter_link') ) { ?> 
                    <a title="<?php echo esc_attr('twitter', 'ecommerce-marketplace'); ?>" target="_blank" href="<?php echo esc_url(get_theme_mod('classic_ecommerce_footer_twitter_link')); ?>"><i class="fab fa-twitter"></i></a>
                <?php } ?>
                <?php if ( get_theme_mod('classic_ecommerce_footer_youtube_link') ) { ?>
                    <a title="<?php echo esc_attr('youtube', 'ecommerce-marketplace'); ?>" target="_blank" href="<?php echo esc_url(get_theme_mod('classic_ecommerce_footer_youtube_link')); ?>"><i class="fab fa-youtube"></i></a>
                <?php } ?>
            </div>
            <?php } ?>
        </div>
      </div>
  </div>
</div>

<?php if(get_theme_mod('classic_ecommerce_scroll_hide','true')){ ?>
    <a id="button"><?php echo esc_html( get_theme_mod('classic_ecommerce_scroll_text',__('TOP', 'ecommerce-marketplace' )) ); ?></a>
<?php } ?>

<?php wp_footer(); ?>
</body>
</html>
