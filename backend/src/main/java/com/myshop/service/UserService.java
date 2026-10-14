package com.myshop.service;

import com.myshop.dto.AddressDto;
import com.myshop.dto.UpdateProfileRequest;
import com.myshop.dto.UserProfileResponse;
import com.myshop.entity.Address;
import com.myshop.entity.User;
import com.myshop.exception.BadRequestException;
import com.myshop.exception.ResourceNotFoundException;
import com.myshop.repository.AddressRepository;
import com.myshop.repository.OrderRepository;
import com.myshop.repository.UserRepository;
import com.myshop.repository.WishlistRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final WishlistRepository wishlistRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       AddressRepository addressRepository,
                       OrderRepository orderRepository,
                       WishlistRepository wishlistRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.wishlistRepository = wishlistRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserProfileResponse res = new UserProfileResponse();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setFullName(user.getFullName());
        res.setPhone(user.getPhone());
        res.setRole(user.getRole().name());
        res.setCreatedAt(user.getCreatedAt());

        List<AddressDto> addressDtos = addressRepository.findByUserId(userId).stream()
                .map(a -> new AddressDto(a.getId(), a.getFullName(), a.getPhone(), a.getStreet(), a.getCity(), a.getState(), a.getPincode(), a.getIsDefault()))
                .collect(Collectors.toList());
        res.setAddresses(addressDtos);

        long orderCount = orderRepository.countByUserId(userId);
        res.setTotalOrders(orderCount);

        long wishlistCount = wishlistRepository.findByUserId(userId)
                .map(w -> (long) w.getItems().size())
                .orElse(0L);
        res.setTotalWishlistItems(wishlistCount);

        // Shopping insight: Favorite category
        res.setFavoriteCategory("Electronics & Fashion");

        return res;
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters long");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
        return getProfile(userId);
    }

    @Transactional
    public AddressDto addAddress(Long userId, AddressDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            addressRepository.findByUserId(userId).forEach(a -> {
                a.setIsDefault(false);
                addressRepository.save(a);
            });
        }

        Address address = new Address(
                user,
                dto.getFullName(),
                dto.getPhone(),
                dto.getStreet(),
                dto.getCity(),
                dto.getState(),
                dto.getPincode(),
                dto.getIsDefault()
        );

        Address saved = addressRepository.save(address);
        return new AddressDto(saved.getId(), saved.getFullName(), saved.getPhone(), saved.getStreet(), saved.getCity(), saved.getState(), saved.getPincode(), saved.getIsDefault());
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Address does not belong to user");
        }

        addressRepository.delete(address);
    }
}
