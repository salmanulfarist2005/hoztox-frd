import React, { useContext } from 'react';
import { FarzaaContext } from '../../context/FarzaaContext';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const sliderSettings = {
    // dots: true,    
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

const BannerSection2 = () => {
    const { handleVideoShow } = useContext(FarzaaContext);

    return (
        <section className="fz-2-banner-section">
            <div className="container position-relative">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="fz-banner-txt">
                            <h1 className="fz-2-heading">Creative Jewelry Collection</h1>
                            <div className="fz-def_btn_wrapper">
                                <Link to="/shop" className="fz-def-btn">
                                    <span></span>
                                    View Our Collections
                                    <i className="fa-light fa-arrow-up-right ml-10"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="fz-banner-vid">
                            <Slider {...sliderSettings}>
                                <div>
                                    <img src="/assets/images/Slider1.jpg" alt="Slider Image 1" />
                                </div>
                                <div>
                                    <img src="/assets/images/Slider7.jpg" alt="Slider Image 2" />
                                </div>
                                <div>
                                    <img src="/assets/images/Slider3.jpg" alt="Slider Image 3" />
                                </div>
                                <div>
                                    <img src="/assets/images/Slider4.jpg" alt="Slider Image 4" />
                                </div>
                                <div>
                                    <img src="/assets/images/Slider5.jpg" alt="Slider Image 5" />
                                </div>
                            </Slider>



                            <div className="fz-banner-rounded-sticker">
                                {/* <img className="fz-rotateText" src="/assets/images/curved-txt.png" alt="Curved Text" /> */}
                                {/* <img className="fz-diamond-icon" src="/assets/images/diamond.png" alt="Diamond" /> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar Section */}
                <div className="fz-cbsearchbar fz-cb-sidebar-area">
                    <button className="fz-cbsearchbar__close"><i className="fa-light fa-xmark"></i></button>
                    <div className="search-wrap text-center">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-8 pt-100 pb-100">
                                    <h2 className="fz-cbsearchbar__title">What Product Are You Looking For?</h2>
                                    <div className="fz-cbsearchbar__form">
                                        <form action="#">
                                            <input type="search" name="s" placeholder="Search Product" />
                                            <button className="fz-cbsearchbar__search-btn" type="submit">
                                                <i className="fa-light fa-magnifying-glass"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fz-overlay"></div>
            </div>
        </section>
    );
}

export default BannerSection2;
