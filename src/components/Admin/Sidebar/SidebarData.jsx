const SidebarData = [
    {
        label: "Dashboard",
        icon: "mdi mdi-home-variant-outline",  
        url: "/dashboard",
    },

    {
        label: "Products",
        icon: "mdi mdi-cart-outline",  
        subItem: [
            { sublabel: "Add products", link: "/add-product" },
            { sublabel: "Add Products by CSV", link: "/add-product-csv" },
            { sublabel: "Manage Products", link: "/manage-products" },
        ],
    },

    {
        label: "Customized Products",
        icon: "mdi mdi-palette-swatch", 
        subItem: [
            { sublabel: "Add products", link: "/add-custom-product" },
            { sublabel: "Manage Products", link: "/manage-custom-products" },
        ],
    },

    {
        label: "Product Categories",
        icon: "mdi mdi-label-outline",  
        subItem: [
            { sublabel: "Add Category", link: "/add-category" },
            { sublabel: "Manage Category", link: "/manage-category" },
        ],
    },

    {
        label: "Users",
        icon: "mdi mdi-account-group-outline",  
        subItem: [
            { sublabel: "Add a User", link: "/add-user" },
            { sublabel: "Manage User", link: "/manage-user" },
            { sublabel: "User Types", link: "/user-type" },
        ],
    },

    {
        label: "Color",
        icon: "mdi mdi-palette",  
        subItem: [
            { sublabel: "Add Color", link: "/color" },
        ],
    },

    {
        label: "Orders",
        icon: "mdi mdi-package-variant-closed",  
        subItem: [
 
           
            { sublabel: "Manage Orders ", link: "/out-order" },
             { sublabel: "Accepted Orders", link: "/accept-order" },
            { sublabel: "Delivered Orders", link: "/completed-order" },
            
        ],
    },

    {
        label: "Customized Orders",
        icon: "mdi mdi-gift-outline",  
        subItem: [
            { sublabel: "Pending Orders", link: "/custom-pending-order" },
            { sublabel: "View Orders", link: "/custom-view-order" },
            { sublabel: "Manage Orders", link: "/custom-manage-order" },
            { sublabel: "Status Csv", link: "/status-csv" },
            { sublabel: "Completed Orders", link: "/custom-completed-order" },
        ],
    },

    {
        label: "Media",
        icon: "mdi mdi-image-outline", 
        subItem: [
            { sublabel: "Add Images", link: "/media" },
            { sublabel: "Manage Images", link: "/manage-images" },
        ],
    },

    {
        label: "Management",
        icon: "mdi mdi-account-circle-outline",  
        subItem: [
            { sublabel: "Change Password", link: "/password-change" },  
        ],
    },
];

export default SidebarData;
