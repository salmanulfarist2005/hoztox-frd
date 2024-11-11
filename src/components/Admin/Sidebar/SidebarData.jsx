


const SidebarData = [
    
    
    {
        label: "Dashboard",
        icon: "mdi mdi-home-variant-outline",
        url: "/dashboard",
       
    },

    {
        label: "Products",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Add products", link: "/add-product" },
            { sublabel: "Add Products by CSV", link: "/add-product-csv" },
            { sublabel: "Manage Products", link: "/manage-products" },
             
        ],
    },

    {
        label: "Customized Products",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Add products", link: "/add-custom-product" },
           
            { sublabel: "Manage Products", link: "/manage-custom-products" },
             
        ],
    },

    {
        label: "Products Categories",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Add Category", link: "/add-category" },           
            { sublabel: "Manage Category", link: "/manage-category" },
             
        ],
    },
    {
        label: "Users",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Add a User", link: "/add-user" },           
            { sublabel: "Manage User", link: "/manage-user" },
            { sublabel: "User Types", link: "/user-type" }, 
        ],
    },
    {
        label: "Color",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Add Color", link: "/color" },           
            
             
        ],
    },
  
    {
        label: "Orders",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "View Orders", link: "/view-order" },           
            { sublabel: "Manage Orders", link: "/manage-order" },
            
        ],
    },
    {
        label: "Customized Orders",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Pending Orders", link: "/custom-pending-order" },           
            { sublabel: "View Orders", link: "/custom-view-order" },
            { sublabel: "Manage Orders", link: "/custom-manage-order" },
            { sublabel: "Status Csv", link: "/status-csv" },

            
        ],
    },
    {
        label: "Full Customized Orders",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Pending Orders", link: "/full-custom-pending-order" },           
            { sublabel: "View Orders", link: "/full-custom-view-order" },
            { sublabel: "Manage Orders", link: "/full-custom-manage-order" },
            { sublabel: "Status Csv", link: "/status-full-csv" },
            
        ],
    },
    {
        label: "Media",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Add Images", link: "/media" },           
            { sublabel: "Manage Images", link: "/manage-images" },
            
        ],
    },

    {
        label: "Management",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Change Password", link: "/password-chanage" },           
            { sublabel: "Manage Admin User", link: "/admin-user" },
            
        ],
    },
   
    
 
 
  
  
     
]
export default SidebarData;