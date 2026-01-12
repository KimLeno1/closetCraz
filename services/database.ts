
import { Product, EngagementRequest, AppNotification, UserStatus, Supplier, UserAccount, Order, OrderStatus } from '../types';
import { PRODUCTS } from '../constants';
import { ARCHIVE_PRODUCTS } from '../extraMockData';

class SilhouetteDatabase {
  private static instance: SilhouetteDatabase;
  private products: Product[] = [];
  private requests: EngagementRequest[] = [];
  private notifications: AppNotification[] = [];
  private suppliers: Supplier[] = [];
  private users: UserAccount[] = [];
  private orders: Order[] = [];

  private constructor() {
    this.initialize();
  }

  public static getInstance(): SilhouetteDatabase {
    if (!SilhouetteDatabase.instance) {
      SilhouetteDatabase.instance = new SilhouetteDatabase();
    }
    return SilhouetteDatabase.instance;
  }

  private initialize() {
    // Initialize Products
    const savedProducts = localStorage.getItem('cc_master_products');
    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    } else {
      this.products = [...PRODUCTS, ...ARCHIVE_PRODUCTS].map(p => {
        let supplierId = undefined;
        let origin: 'admin' | 'supplier' = 'admin';
        
        if (p.id === '1') { supplierId = 'SUP-001'; origin = 'supplier'; }
        if (p.id === '2') { supplierId = 'SUP-002'; origin = 'supplier'; }
        if (p.id === 'a1') { supplierId = 'SUP-001'; origin = 'supplier'; }
        
        return {
          ...p,
          origin,
          supplierId,
          status: 'DEPLOYED'
        };
      });
      this.syncProducts();
    }

    // Initialize Orders
    const savedOrders = localStorage.getItem('cc_master_orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
    } else {
      this.orders = [
        {
          id: 'TX-8812',
          date: 'OCT 14, 2024',
          items: [this.products[0]],
          total: 890,
          status: 'Received',
          orderType: 'Standard',
          pointsEarned: 133
        },
        {
          id: 'TX-9045',
          date: 'NOV 02, 2024',
          items: [this.products[1], this.products[2]],
          total: 1530,
          status: 'Deployed',
          orderType: 'Standard',
          pointsEarned: 229
        }
      ];
      this.syncOrders();
    }

    // Initialize Requests
    const savedRequests = localStorage.getItem('cc_master_requests');
    if (savedRequests) {
      this.requests = JSON.parse(savedRequests);
    } else {
      this.requests = [
        {
          id: 'REQ-9901',
          type: 'BESPOKE',
          origin: 'V.Thorne',
          target: 'Obsidian Drape Coat',
          timestamp: new Date().toISOString(),
          status: 'PENDING',
          priority: 'CRITICAL',
          details: 'Requesting carbon-fiber reinforcement on lapels and internal concealed weapon pocket integration.'
        },
        {
          id: 'REQ-8842',
          type: 'SUPPLY',
          origin: 'KODA_STUDIOS',
          timestamp: new Date().toISOString(),
          status: 'PENDING',
          priority: 'STANDARD',
          details: 'Proposition: Ultra-thin liquid silk weave with photo-reactive pigment layer for adaptive camouflage.'
        }
      ];
      this.syncRequests();
    }

    // Initialize Notifications
    const savedNotes = localStorage.getItem('cc_master_notifications');
    if (savedNotes) {
      this.notifications = JSON.parse(savedNotes);
    } else {
      this.notifications = [
        {
          id: 'note-1',
          title: 'NEURAL LINK ESTABLISHED',
          content: 'Welcome to the collective. Your aesthetic trajectory is now under monitoring.',
          type: 'PROTOCOL',
          timestamp: new Date().toISOString(),
          read: false,
          targetTier: 'ALL'
        }
      ];
      this.syncNotifications();
    }

    // Initialize Suppliers
    const savedSuppliers = localStorage.getItem('cc_master_suppliers');
    if (savedSuppliers) {
      this.suppliers = JSON.parse(savedSuppliers);
    } else {
      this.suppliers = [
        {
          id: 'SUP-001',
          name: 'THORN_COLLECTIVE',
          region: 'Northern Spire',
          specialty: 'Monolithic Outerwear',
          status: 'OPERATIONAL',
          resilienceScore: 94,
          activeAssets: 12,
          onboardedDate: '2023-11-12'
        },
        {
          id: 'SUP-002',
          name: 'KODA_LABS',
          region: 'Neo-Sect 4',
          specialty: 'Cyber-Knitwear',
          status: 'OPERATIONAL',
          resilienceScore: 88,
          activeAssets: 8,
          onboardedDate: '2024-01-05'
        }
      ];
      this.syncSuppliers();
    }

    // Initialize Users
    const savedUsers = localStorage.getItem('cc_master_users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    } else {
      this.users = [
        {
          id: 'USR-001',
          username: 'V.Thorne',
          email: 'v@thorne.ext',
          status: UserStatus.ICON,
          points: 24500,
          diamonds: 850,
          joinedDate: '2023-10-14',
          lastActive: new Date().toISOString()
        },
        {
          id: 'USR-002',
          username: 'M.Sterling',
          email: 'm@sterling.ext',
          status: UserStatus.TRENDSETTER,
          points: 12400,
          diamonds: 320,
          joinedDate: '2024-01-12',
          lastActive: new Date().toISOString()
        }
      ];
      this.syncUsers();
    }
  }

  private syncProducts() {
    localStorage.setItem('cc_master_products', JSON.stringify(this.products));
  }

  private syncRequests() {
    localStorage.setItem('cc_master_requests', JSON.stringify(this.requests));
  }

  private syncNotifications() {
    localStorage.setItem('cc_master_notifications', JSON.stringify(this.notifications));
  }

  private syncSuppliers() {
    localStorage.setItem('cc_master_suppliers', JSON.stringify(this.suppliers));
  }

  private syncUsers() {
    localStorage.setItem('cc_master_users', JSON.stringify(this.users));
  }

  private syncOrders() {
    localStorage.setItem('cc_master_orders', JSON.stringify(this.orders));
  }

  // Order Operations
  public getAllOrders(): Order[] {
    return [...this.orders];
  }

  public addOrder(order: Order): void {
    this.orders.unshift(order);
    this.syncOrders();
  }

  public updateOrderStatus(id: string, status: OrderStatus): void {
    this.orders = this.orders.map(o => o.id === id ? { ...o, status } : o);
    this.syncOrders();
  }

  // User Operations
  public getAllUsers(): UserAccount[] {
    return [...this.users];
  }

  public addUser(user: UserAccount): void {
    this.users.push(user);
    this.syncUsers();
  }

  public updateUser(updatedUser: UserAccount): void {
    this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    this.syncUsers();
  }

  public deleteUser(id: string): void {
    this.users = this.users.filter(u => u.id !== id);
    this.syncUsers();
  }

  // Product Operations
  public getAllProducts(): Product[] {
    return [...this.products];
  }

  public addProduct(product: Product): void {
    this.products.push({ ...product, status: product.status || 'DEPLOYED' });
    this.syncProducts();
  }

  public updateProduct(updatedProduct: Product): void {
    this.products = this.products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    this.syncProducts();
  }

  public deleteProduct(id: string): void {
    this.products = this.products.filter(p => p.id !== id);
    this.syncProducts();
  }

  // Request Operations
  public getAllRequests(): EngagementRequest[] {
    return [...this.requests];
  }

  public addRequest(request: EngagementRequest): void {
    this.requests.unshift(request);
    this.syncRequests();
  }

  public updateRequestStatus(id: string, status: EngagementRequest['status']): void {
    this.requests = this.requests.map(r => r.id === id ? { ...r, status } : r);
    this.syncRequests();
  }

  public purgeRequest(id: string): void {
    this.requests = this.requests.filter(r => r.id !== id);
    this.syncRequests();
  }

  // Notification Operations
  public getAllNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public addNotification(note: AppNotification): void {
    this.notifications.unshift(note);
    this.syncNotifications();
  }

  public updateNotification(updatedNote: AppNotification): void {
    this.notifications = this.notifications.map(n => n.id === updatedNote.id ? updatedNote : n);
    this.syncNotifications();
  }

  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.syncNotifications();
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    this.syncNotifications();
  }

  // Supplier Operations
  public getAllSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  public addSupplier(supplier: Supplier): void {
    this.suppliers.push(supplier);
    this.syncSuppliers();
  }

  public updateSupplierStatus(id: string, status: Supplier['status']): void {
    this.suppliers = this.suppliers.map(s => s.id === id ? { ...s, status } : s);
    this.syncSuppliers();
  }

  public deleteSupplier(id: string): void {
    this.suppliers = this.suppliers.filter(s => s.id !== id);
    this.syncSuppliers();
  }

  // Export Logic
  public generateCSV(collection: 'products' | 'requests' | 'notifications' | 'suppliers' | 'users' | 'orders'): string {
    const dataMap: any = {
      products: this.products,
      requests: this.requests,
      notifications: this.notifications,
      suppliers: this.suppliers,
      users: this.users,
      orders: this.orders
    };
    const data = dataMap[collection] || [];
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const val = (row as any)[header];
        const escaped = ('' + val).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  public generateSQL(collection: 'products' | 'requests' | 'notifications' | 'suppliers' | 'users' | 'orders'): string {
    const dataMap: any = {
      products: this.products,
      requests: this.requests,
      notifications: this.notifications,
      suppliers: this.suppliers,
      users: this.users,
      orders: this.orders
    };
    const data = dataMap[collection] || [];
    if (data.length === 0) return '';

    const tableName = collection;
    const headers = Object.keys(data[0]);
    const sqlStatements = data.map(row => {
      const values = headers.map(header => {
        const val = (row as any)[header];
        if (typeof val === 'string') {
          return `'${val.replace(/'/g, "''")}'`;
        }
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return val;
      });
      return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});`;
    });

    return `-- Silhouette Protocol Master Dump\n-- Collection: ${collection}\n-- Date: ${new Date().toISOString()}\n\n` + sqlStatements.join('\n');
  }

  public triggerDownload(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const db = SilhouetteDatabase.getInstance();
