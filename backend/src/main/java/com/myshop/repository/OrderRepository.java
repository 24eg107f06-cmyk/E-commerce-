package com.myshop.repository;

import com.myshop.entity.Order;
import com.myshop.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    @Query("SELECT SUM(o.finalAmount) FROM Order o WHERE o.status != 'CANCELLED'")
    Double calculateTotalRevenue();

    long countByUserId(Long userId);
}
