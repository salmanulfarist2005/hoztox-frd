const SidebarData = [
    {
        label: "Dashboard",
        icon: "mdi mdi-home-variant-outline", // Dashboard icon
        url: "/dashboard",
    },

    {
        label: "Products",
        icon: "mdi mdi-cart-outline", // Shopping cart icon
        subItem: [
            { sublabel: "Add products", link: "/add-product" },
            { sublabel: "Add Products by CSV", link: "/add-product-csv" },
            { sublabel: "Manage Products", link: "/manage-products" },
        ],
    },

    {
        label: "Customized Products",
        icon: "mdi mdi-palette-swatch", // Palette icon for customization
        subItem: [
            { sublabel: "Add products", link: "/add-custom-product" },
            { sublabel: "Manage Products", link: "/manage-custom-products" },
        ],
    },

    {
        label: "Product Categories",
        icon: "mdi mdi-label-outline", // Label icon for categories
        subItem: [
            { sublabel: "Add Category", link: "/add-category" },
            { sublabel: "Manage Category", link: "/manage-category" },
        ],
    },

    {
        label: "Users",
        icon: "mdi mdi-account-group-outline", // Account group icon for users
        subItem: [
            { sublabel: "Add a User", link: "/add-user" },
            { sublabel: "Manage User", link: "/manage-user" },
            { sublabel: "User Types", link: "/user-type" },
        ],
    },

    {
        label: "Color",
        icon: "mdi mdi-palette", // Palette icon for color management
        subItem: [
            { sublabel: "Add Color", link: "/color" },
        ],
    },

    {
        label: "Orders",
        icon: "mdi mdi-package-variant-closed",  
        subItem: [
            // { sublabel: "View Orders", link: "/view-order/:orderId" },
            // { sublabel: "Manage Orders", link: "/manage-order" },
            { sublabel: "Delivered Orders", link: "/completed-order" },
            { sublabel: "Manage Orders ", link: "/out-order" },
            
        ],
    },

    {
        label: "Customized Orders",
        icon: "mdi mdi-gift-outline", // Gift icon for customized orders
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
